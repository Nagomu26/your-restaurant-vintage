import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONFIG } from "@/lib/config";

const NAV_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#reserva", label: "Reserva" },
  { href: "#contacto", label: "Contacto" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b-4 transition-all duration-300",
        scrolled ? "border-grana bg-papel/95 shadow-soltar backdrop-blur" : "border-tinta bg-papel",
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <a href="#inicio" className="group flex items-center gap-3" aria-label={CONFIG.nombre}>
          <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-[3px] border-grana bg-red-50 text-center leading-none transition-transform duration-300 group-hover:rotate-12">
            <span className="font-display text-lg leading-none text-grana">YB</span>
          </span>
          <span className="leading-tight">
            <span className="font-display block text-xl tracking-wide">
              {CONFIG.logoNombre.toUpperCase()}{" "}
              <span className="text-grana">{CONFIG.logoAcento.toUpperCase()}</span>
            </span>
            <span className="block text-[10px] uppercase tracking-[0.3em] text-azul">
                    Restaurante · Est. 2026
            </span>
          </span>
        </a>

        <div className="hidden items-center gap-7 text-sm font-semibold tracking-wide text-tinta md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="border-b-2 border-transparent uppercase transition-colors duration-300 hover:border-grana hover:text-grana"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#reserva"
            className="hidden rounded-sm bg-grana px-5 py-2.5 font-display text-base tracking-wide text-crema shadow-rojo transition-all duration-300 hover:-translate-y-0.5 hover:bg-azul sm:inline-flex"
          >
            Reservar cita
          </a>
          <button
            type="button"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="-mr-2 p-2 text-tinta transition-colors hover:text-grana md:hidden"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t-2 border-lineacream bg-papel md:hidden">
          <div className="flex flex-col gap-4 px-5 py-4 text-sm font-semibold uppercase tracking-wide text-tinta">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="border-b-2 border-transparent py-1 transition-colors hover:border-grana hover:text-grana"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#reserva"
              onClick={() => setMenuOpen(false)}
              className="mt-1 inline-flex items-center justify-center rounded-sm bg-grana px-5 py-3 font-display text-base tracking-wide text-crema transition-colors hover:bg-azul"
            >
              Reservar cita
            </a>
          </div>
        </div>
      )}
    </header>
  );
}