import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CONFIG } from "@/lib/config";
import {
  DIAS_ANTELACION,
  NOMBRES_DIA,
  NOMBRES_MES,
  construirPayload,
  esHoraYaPasada,
  estaOcupadaDemo,
  fechaISO,
  generarHoras,
  guardarReservaEnSheet,
  obtenerHorasOcupadas,
  precargarOcupadas,
} from "@/lib/booking";
import type { OcupadasPorDia, ServiceId } from "@/lib/types";
import type { LegalDocId } from "@/lib/legal";
import { SERVICIOS } from "@/data/services";
import { Reveal } from "./Reveal";

type Mensaje = { tipo: "ok" | "error"; texto: string } | null;

function Paso({
  numero,
  titulo,
  children,
}: {
  numero: number;
  titulo: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <span className="step-badge inline-flex h-9 w-9 items-center justify-center rounded-full font-display text-lg">
          {numero}
        </span>
        <p className="font-display text-xl uppercase tracking-wide text-crema">{titulo}</p>
      </div>
      {children}
    </div>
  );
}

function Resumen({
  fecha,
  hora,
  servicioNombre,
  hoyISO,
}: {
  fecha: Date | null;
  hora: string | null;
  servicioNombre: string | null;
  hoyISO: string;
}) {
  if (fecha && hora && servicioNombre) {
    const esHoy = fechaISO(fecha) === hoyISO;
    const nombreDia = NOMBRES_DIA[fecha.getDay()];
    const fechaTexto = esHoy
      ? `hoy (${fecha.getDate()} de ${NOMBRES_MES[fecha.getMonth()]})`
      : `${nombreDia} ${fecha.getDate()} de ${NOMBRES_MES[fecha.getMonth()]}`;

    return (
      <p className="text-sm italic text-crema/80">
        Vas a reservar{" "}
        <span className="font-bold not-italic text-crema">{servicioNombre}</span>{" "}
        {esHoy ? "para" : "el"}{" "}
        <span className="font-bold not-italic text-crema">{fechaTexto}</span> a las{" "}
        <span className="font-bold not-italic text-mostaza">{hora}</span>.
      </p>
    );
  }
  return <p className="text-sm italic text-crema/70">Todavía no has elegido día, hora o servicio.</p>;
}

export function Booking({ onOpenLegal }: { onOpenLegal: (docId: LegalDocId) => void }) {
  const [fecha, setFecha] = useState<Date | null>(null);
  const [hora, setHora] = useState<string | null>(null);
  const [servicioId, setServicioId] = useState<ServiceId | null>(null);
  const [ocupadasPorDia, setOcupadasPorDia] = useState<OcupadasPorDia | null>(null);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [consent, setConsent] = useState(false);
  const [mensaje, setMensaje] = useState<Mensaje>(null);
  const [enviando, setEnviando] = useState(false);

  const hoy = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const dias = useMemo(
    () =>
      Array.from({ length: DIAS_ANTELACION }, (_, i) => {
        const d = new Date(hoy);
        d.setDate(hoy.getDate() + i);
        return d;
      }),
    [hoy],
  );

  useEffect(() => {
    void precargarOcupadas().then(setOcupadasPorDia);
  }, []);

  const servicio = SERVICIOS.find((s) => s.id === servicioId) ?? null;
  const horas = fecha ? generarHoras(fecha) : [];
  const horasOcupadas = fecha
    ? obtenerHorasOcupadas(ocupadasPorDia, fechaISO(fecha))
    : null;

  const esHoy = fecha !== null && fechaISO(fecha) === fechaISO(hoy);
  const esOcupada = (franja: string) =>
    esHoraYaPasada(fecha ?? hoy, franja) ||
    (horasOcupadas
      ? horasOcupadas.includes(franja)
      : fecha
        ? estaOcupadaDemo(fechaISO(fecha), franja)
        : false);

  const puedeEnviar =
    !!fecha &&
    !!hora &&
    !!servicio &&
    nombre.trim().length > 0 &&
    telefono.trim().length > 0 &&
    consent;

  const slotHelp = !fecha
    ? "Selecciona primero un día para ver las horas disponibles."
    : esHoy
      ? "Horas para hoy. Las horas ya pasadas o reservadas no se pueden elegir."
      : `Horas para el ${fecha.getDate()} de ${NOMBRES_MES[fecha.getMonth()]}. Las horas tachadas ya están reservadas.`;

  function seleccionarDia(dia: Date) {
    setFecha(dia);
    setHora(null);
  }

  function seleccionarHora(franja: string) {
    setHora(franja);
  }

  function seleccionarServicio(id: ServiceId) {
    setServicioId(id);
  }

  async function enviarReserva(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (String(new FormData(e.currentTarget).get("website") ?? "").length > 0) return;
    if (!puedeEnviar || enviando) return;
    if (!fecha || !hora || !servicio) return;

    const payload = construirPayload(fecha, hora, servicio, nombre, telefono);
    setEnviando(true);
    setMensaje(null);

    try {
      const resultado = await guardarReservaEnSheet(payload);
      if (!resultado.ok) {
        if (resultado.motivo === "ocupado") {
          marcarHoraOcupadaLocal(fecha, hora);
          setMensaje({
            tipo: "error",
            texto: "Lo sentimos, esa hora se acaba de reservar. Elige otra hora, por favor.",
          });
        } else if (resultado.motivo === "pasado") {
          marcarHoraOcupadaLocal(fecha, hora);
          setMensaje({
            tipo: "error",
            texto: "Esa hora ya ha pasado. Elige otra hora, por favor.",
          });
        } else {
          throw new Error("El Google Sheet no confirmó el guardado");
        }
        return;
      }

      marcarHoraOcupadaLocal(fecha, hora);
      void precargarOcupadas().then(setOcupadasPorDia);

      setMensaje({
        tipo: "ok",
        texto: "¡Reserva enviada! Te confirmaremos tu mesa muy pronto por teléfono o WhatsApp.",
      });
      setFecha(null);
      setHora(null);
      setServicioId(null);
      setNombre("");
      setTelefono("");
      setConsent(false);
    } catch (error) {
      console.error("Error al enviar la reserva:", error);
      setMensaje({
        tipo: "error",
        texto: `No hemos podido enviar tu reserva. Llámanos al ${CONFIG.telefono} y te atendemos directamente.`,
      });
    } finally {
      setEnviando(false);
    }
  }

  function marcarHoraOcupadaLocal(dia: Date, franja: string) {
    const iso = fechaISO(dia);
    setOcupadasPorDia((prev) => {
      const base = prev ?? {};
      const previas = base[iso] ?? [];
      if (previas.includes(franja)) return base;
      return { ...base, [iso]: [...previas, franja] };
    });
  }

  return (
    <section id="reserva" className="relative overflow-hidden bg-azul">
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
        <Reveal className="mb-12 text-center">
          <p className="font-display mb-3 text-lg uppercase tracking-widest text-mostaza">
            ★ Reserva de mesa
          </p>
          <h2 className="font-display text-5xl uppercase tracking-wide text-crema sm:text-6xl">
            Tu hora, tu sitio
          </h2>
          <p className="mx-auto mt-5 max-w-lg italic text-crema/80">
            Elige el día, la hora libre y el servicio. Aceptamos reservas con hasta una
            semana de antelación.
          </p>
        </Reveal>

        <form onSubmit={enviarReserva} className="space-y-12 rounded-md border-4 border-crema/15 bg-tinta/40 p-6 shadow-cardglow3 sm:p-10" noValidate>
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
          <Reveal>
            <Paso numero={1} titulo="Elige el día">
              <div
                className="flex gap-3 overflow-x-auto py-2"
                role="listbox"
                aria-label="Selecciona un día"
              >
                {dias.map((dia, i) => {
                  const activo = fecha !== null && fechaISO(fecha) === fechaISO(dia);
                  const esDiaHoy = i === 0;
                  return (
                    <button
                      key={fechaISO(dia)}
                      type="button"
                      onClick={() => seleccionarDia(dia)}
                      aria-pressed={activo}
                      className={cn(
                        "day-option flex flex-col w-16 flex-shrink-0 cursor-pointer rounded-md border-2 border-crema/25 bg-crema py-3 text-center transition-all duration-200",
                        "hover:-translate-y-0.5 hover:border-mostaza",
                        activo && "seleccionado",
                      )}
                    >
                      <span
                        className="block text-xs font-bold"
                        style={{ color: esDiaHoy ? "#b23a2e" : "#2e2b27" }}
                      >
                        {esDiaHoy ? "Hoy" : NOMBRES_DIA[dia.getDay()]}
                      </span>
                      <span className="font-display mt-1 block text-2xl text-tinta">
                        {dia.getDate()}
                      </span>
                      <span className="block text-[11px] text-tinta/70">
                        {NOMBRES_MES[dia.getMonth()]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Paso>
          </Reveal>

          <Reveal>
            <Paso numero={2} titulo="Elige la hora">
              <p className="mb-4 text-sm italic text-crema/70">{slotHelp}</p>
              <div
                className="grid grid-cols-3 gap-2.5 sm:grid-cols-4"
                role="listbox"
                aria-label="Selecciona una hora"
              >
                {horas.map((franja) => {
                  const ocupada = esOcupada(franja);
                  const activa = hora === franja;
                  return (
                    <button
                      key={franja}
                      type="button"
                      onClick={() => seleccionarHora(franja)}
                      disabled={ocupada}
                      aria-pressed={activa}
                      className={cn(
                        "slot-option rounded-full border-2 py-2.5 text-sm transition-colors duration-200",
                        ocupada
                          ? "slot-occupied cursor-not-allowed border-crema/20 text-crema/40 line-through opacity-60"
                          : cn(
                              "border-crema/25 bg-crema text-tinta",
                              "hover:-translate-y-0.5 hover:border-mostaza",
                            ),
                        activa && "seleccionado",
                      )}
                    >
                      {franja}
                    </button>
                  );
                })}
              </div>
              <div className="mt-5 flex flex-wrap gap-5 text-xs text-crema/70">
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-crema/25 bg-crema"></span>
                  Libre
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block h-3.5 w-3.5 rounded-full bg-grana"></span>
                  Seleccionada
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="relative inline-flex h-3.5 w-3.5 items-center justify-center overflow-hidden rounded-full border-2 border-crema/25 bg-crema">
                    <span className="slot-occupied absolute inset-0" aria-hidden="true"></span>
                  </span>
                  Ocupada
                </span>
              </div>
            </Paso>
          </Reveal>

          <Reveal>
            <Paso numero={3} titulo="Elige tu plato">
              <div
                className="grid grid-cols-2 gap-2.5 sm:grid-cols-4"
                role="listbox"
                aria-label="Selecciona un servicio"
              >
                {SERVICIOS.map((s) => {
                  const activo = servicioId === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => seleccionarServicio(s.id)}
                      aria-pressed={activo}
                      className={cn(
                        "service-option cursor-pointer rounded-md border-2 border-crema/25 bg-crema p-4 text-left transition-all duration-200",
                        "hover:-translate-y-0.5 hover:border-mostaza",
                        activo && "seleccionado",
                      )}
                    >
                      <span className="block text-sm font-bold text-tinta">
                        {s.nombre}
                      </span>
                      <span className="font-display mt-1 block text-xl text-grana">
                        {s.precio} €
                      </span>
                    </button>
                  );
                })}
              </div>
            </Paso>
          </Reveal>

          <Reveal>
            <Paso numero={4} titulo="Tus datos">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="nombre"
                    className="mb-2 block text-xs font-bold uppercase tracking-widest text-crema/70"
                  >
                    Nombre y apellidos
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required
                    autoComplete="name"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full rounded-md border-2 border-crema/25 bg-crema px-4 py-3 text-tinta transition-colors placeholder:text-tinta/50 focus:border-mostaza"
                  />
                </div>
                <div>
                  <label
                    htmlFor="telefono"
                    className="mb-2 block text-xs font-bold uppercase tracking-widest text-crema/70"
                  >
                    Teléfono
                  </label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="600 000 000"
                    className="w-full rounded-md border-2 border-crema/25 bg-crema px-4 py-3 text-tinta transition-colors placeholder:text-tinta/50 focus:border-mostaza"
                  />
                </div>
              </div>
            </Paso>
          </Reveal>

          <Reveal>
            <div className="border-t-2 border-crema/15 pt-8">
              <div className="mb-6 rounded-md border-2 border-crema/25 bg-tinta/30 p-5">
                <label
                  htmlFor="consent"
                  className="flex cursor-pointer items-start gap-3 text-sm text-crema/90"
                >
                  <input
                    id="consent"
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    aria-describedby="consent-help"
                    className="mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer accent-grana"
                  />
                  <span>
                    He leído y acepto la Política de privacidad y los Términos y condiciones.
                  </span>
                </label>
                <div
                  id="consent-help"
                  className="mt-2 space-y-1 text-xs leading-relaxed text-crema/70"
                >
                  <p>
                    Tu nombre y teléfono se usan únicamente para gestionar tu cita. No se
                    ceden a terceros.
                  </p>
                  <p className="space-x-3">
                    {(
                      [
                        ["privacidad", "Política de privacidad"],
                        ["terminos", "Términos y condiciones"],
                        ["cookies", "Política de cookies"],
                      ] as const
                    ).map(([key, etiqueta]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => onOpenLegal(key)}
                        className="text-mostaza underline underline-offset-2 transition-colors hover:text-crema"
                      >
                        {etiqueta}
                      </button>
                    ))}
                  </p>
                </div>
              </div>

              <div className="mb-6 rounded-md border-2 border-crema/25 bg-tinta/30 p-5">
                <Resumen
                  fecha={fecha}
                  hora={hora}
                  servicioNombre={servicio?.nombre ?? null}
                  hoyISO={fechaISO(hoy)}
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={!puedeEnviar || enviando}
                  className="rounded-sm bg-grana px-10 py-4 font-display text-xl tracking-wide text-crema shadow-rojo transition-all duration-300 hover:-translate-y-0.5 hover:bg-mostaza hover:text-tinta disabled:pointer-events-none disabled:opacity-40"
                >
                  {enviando ? "Procesando..." : "Confirmar reserva"}
                </button>
                {mensaje && (
                  <p
                    className={cn(
                      "text-sm italic",
                      mensaje.tipo === "ok" ? "text-mostaza" : "text-crema",
                    )}
                    role="status"
                  >
                    {mensaje.texto}
                  </p>
                )}
              </div>
            </div>
          </Reveal>
        </form>

        <Reveal>
          <p className="mt-8 text-center italic text-crema/80">
            ¿Prefieres hablar directamente? Escríbenos por{" "}
            <a
              href={`https://wa.me/${CONFIG.whatsapp}`}
              className="font-bold not-italic text-mostaza underline underline-offset-2 transition-colors hover:text-crema"
            >
              WhatsApp al {CONFIG.telefono}
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}