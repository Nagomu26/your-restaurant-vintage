import { Reveal } from "./Reveal";

const IMAGENES = [
  { src: "img/haircut-close.jpg", alt: "Detalle de la mesa", rot: "-rotate-2" },
  { src: "img/fade.jpg", alt: "Degradado en proceso", rot: "rotate-1" },
  { src: "img/chairs.jpg", alt: "Mesas puestas del restaurante", rot: "-rotate-1" },
];

export function Gallery() {
  return (
    <section id="galeria" className="relative overflow-hidden bg-papel">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <Reveal className="mb-12 text-center">
          <p className="font-display mb-3 text-lg uppercase tracking-widest text-azul">
            ★ Nuestro trabajo
          </p>
          <h2 className="font-display text-5xl uppercase tracking-wide text-tinta sm:text-6xl">
            Galería
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {IMAGENES.map((img, i) => (
            <Reveal key={img.src} delay={i * 80}>
              <figure
                className={`${img.rot} group border-[5px] border-crema bg-crema p-2 shadow-cardglow3 transition-all duration-300 hover:rotate-0 hover:border-grana`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="aspect-[4/3] w-full object-cover sepia transition-all duration-500 group-hover:sepia-0"
                  loading="lazy"
                />
                <figcaption className="px-1 py-2 text-center font-display text-sm uppercase tracking-[0.2em] text-tinta">
                  {img.alt}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}