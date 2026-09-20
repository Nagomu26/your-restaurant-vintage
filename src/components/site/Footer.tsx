import { Clock, MapPin, Phone } from "lucide-react";
import { CONFIG } from "@/lib/config";
import type { LegalDocId } from "@/lib/legal";
import { Reveal } from "./Reveal";

const ENLACES_LEGALES = [
  { key: "privacidad", etiqueta: "Política de privacidad" },
  { key: "terminos", etiqueta: "Términos y condiciones" },
  { key: "cookies", etiqueta: "Política de cookies" },
] as const;

export function Footer({ onOpenLegal }: { onOpenLegal: (docId: LegalDocId) => void }) {
  return (
    <footer id="contacto" className="relative overflow-hidden border-t-4 border-grana bg-tinta text-crema">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        <Reveal>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <a href="#inicio" className="flex items-center gap-3">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-[3px] border-mostaza bg-crema/10 text-center leading-none">
                  <span className="font-display text-lg leading-none text-mostaza">YB</span>
                </span>
                <span className="leading-tight">
                  <span className="font-display block text-2xl tracking-wide">
                    {CONFIG.logoNombre.toUpperCase()}{" "}
                    <span className="text-mostaza">{CONFIG.logoAcento.toUpperCase()}</span>
                  </span>
                  <span className="block text-[10px] uppercase tracking-[0.3em] text-crema/60">
                    Restaurante · Est. 2026
                  </span>
                </span>
              </a>
              <p className="mt-5 max-w-md text-sm italic leading-relaxed text-crema/70">
                Donde la buena mesa nunca pasa de moda. Reserva tu mesa online y entra
                directo a tu cita.
              </p>
            </div>

            <div>
              <p className="font-display mb-4 text-lg uppercase tracking-widest text-mostaza">
                Contacto
              </p>
              <ul className="space-y-3 text-sm text-crema/80">
                <li>
                  <a
                    href={`tel:${CONFIG.telefonoEnlace}`}
                    className="inline-flex items-center gap-2 transition-colors hover:text-mostaza"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {CONFIG.telefono}
                  </a>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${CONFIG.whatsapp}`}
                    className="inline-flex items-center gap-2 transition-colors hover:text-mostaza"
                  >
                    <span className="font-bold text-mostaza">WA</span>
                    WhatsApp · {CONFIG.telefono}
                  </a>
                </li>
                <li className="inline-flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4" aria-hidden="true" />
                  <span>
                    {CONFIG.direccion}, {CONFIG.ciudad}
                    <br />
                    {CONFIG.localidad}
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-display mb-4 text-lg uppercase tracking-widest text-mostaza">
                Horario
              </p>
              <ul className="space-y-3 text-sm text-crema/80">
                <li className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  <span>
                    Lun–Sáb: 10h–14h / 16h–21h
                    <br />
                    Domingo: 9h–14h
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-crema/60">
            © {new Date().getFullYear()} {CONFIG.nombre}. Todos los derechos reservados.
          </p>
          <nav aria-label="Enlaces legales" className="flex flex-wrap gap-x-6 gap-y-2">
            {ENLACES_LEGALES.map((enlace) => (
              <button
                key={enlace.key}
                type="button"
                onClick={() => onOpenLegal(enlace.key)}
                className="text-xs text-crema/60 underline underline-offset-2 transition-colors hover:text-mostaza"
              >
                {enlace.etiqueta}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="select-none" aria-hidden="true">
        <p className="border-t-2 border-crema/10 text-center font-display text-[16vw] leading-[1.1] tracking-wider text-crema/[0.06] sm:text-[12vw]">
          {CONFIG.logoAcento.toUpperCase()}
        </p>
      </div>
    </footer>
  );
}