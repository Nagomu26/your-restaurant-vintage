import { CONFIG } from "@/lib/config";
import { SERVICIOS } from "@/data/services";
import { Reveal } from "./Reveal";

export function Services() {
  return (
    <section id="servicios" className="relative overflow-hidden bg-azul">
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
        <Reveal className="mb-12 text-center">
          <p className="font-display mb-3 text-lg uppercase tracking-widest text-mostaza">
            ★ La carta
          </p>
          <h2 className="font-display text-5xl uppercase tracking-wide text-crema sm:text-6xl">
            La Carta
          </h2>
          <p className="mx-auto mt-5 max-w-md italic text-crema/80">
            Precios de siempre, sin letra pequeña y con el mismo trato de antes.
          </p>
        </Reveal>

        <Reveal className="border-4 border-crema/20 bg-tinta/40 p-6 shadow-cardglow3 sm:p-10">
          <ul className="divide-y divide-crema/15">
            {SERVICIOS.map((servicio) => (
              <li key={servicio.id} className="group py-6 first:pt-0 last:pb-0">
                <div className="flex items-baseline gap-3">
                  <h3 className="text-lg italic text-crema transition-colors duration-300 group-hover:text-mostaza sm:text-xl">
                    {servicio.nombre}
                  </h3>
                  {servicio.destacado && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-mostaza px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-tinta">
                      ★ El más pedido
                    </span>
                  )}
                  <span className="flex-1 border-b-2 border-dotted border-crema/30" aria-hidden="true"></span>
                  <span className="font-display text-2xl text-mostaza sm:text-3xl">
                    {servicio.precio} €
                  </span>
                </div>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-crema/70">
                  {servicio.descripcion}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-10 text-center">
          <p className="italic text-crema/80">
            ¿Hablamos? Escríbenos por{" "}
            <a
              href={`https://wa.me/${CONFIG.whatsapp}`}
              className="font-bold text-mostaza underline underline-offset-2 transition-colors hover:text-crema"
            >
              WhatsApp al {CONFIG.telefono}
            </a>{" "}
            y te aconsejamos sin compromiso.
          </p>
        </Reveal>
      </div>
    </section>
  );
}