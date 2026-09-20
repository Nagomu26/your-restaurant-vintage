import { useState } from "react";
import { cn } from "@/lib/utils";
import { CONFIG } from "@/lib/config";
import type { LegalDocId } from "@/lib/legal";

const FLOTANTE = "fixed bottom-5 left-5 right-5 z-[80] sm:left-auto sm:max-w-md";

export function CookieBanner({ onOpenLegal }: { onOpenLegal: (docId: LegalDocId) => void }) {
  const [oculto, setOculto] = useState(
    () => localStorage.getItem("cookie-accept") === "accepted",
  );

  const aceptar = () => {
    localStorage.setItem("cookie-accept", "accepted");
    setOculto(true);
  };

  if (oculto) return null;

  return (
    <div className={cn(FLOTANTE, "animate-[cookie-in_.4s_ease]")} role="dialog" aria-label="Aviso de cookies">
      <style>{`@keyframes cookie-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}`}</style>
      <div className="rounded-md border-4 border-grana bg-papel/95 p-5 shadow-cardglow3 backdrop-blur">
        <p className="closeable text-sm">
          <strong className="font-bold text-tinta">Cookies</strong>{" "}
          <span className="text-tinta/80">
            Usamos cookies técnicas (sin publicidad ni seguimiento) para que Aviso legal y
            la web funcionen bien.{" "}
          </span>
          <button
            type="button"
            onClick={() => onOpenLegal("cookies")}
            className="text-grana underline underline-offset-2 hover:text-azul"
          >
            Más información
          </button>
          <span className="text-tinta/80"> · {CONFIG.nombre}.</span>
        </p>
        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => onOpenLegal("privacidad")}
            className="text-xs font-semibold uppercase tracking-wider text-tinta/70 transition-colors hover:text-azul"
          >
            Privacidad
          </button>
          <button
            type="button"
            onClick={aceptar}
            className="rounded-sm bg-grana px-6 py-2.5 font-display text-base tracking-wide text-crema transition-colors hover:bg-azul"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}