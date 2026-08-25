import { ArrowLeft, FileQuestion } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#f5f1e8] p-6 text-[#171611]">
      <section className="w-full max-w-xl rounded-[2rem] border border-[#d9d2c4] bg-[#fffdf8] p-8 text-center shadow-[0_24px_80px_rgba(56,40,21,0.10)] sm:p-12">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#efe2d1] text-[#b76421]"><FileQuestion size={28} /></span>
        <p className="mt-6 text-xs font-bold uppercase tracking-[.16em] text-[#b76421]">Error 404</p>
        <h1 className="mt-3 font-[var(--font-display)] text-4xl tracking-[-.04em]">Esta página no está disponible.</h1>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[#696459]">La ruta puede haber cambiado o no formar parte de la herramienta pública.</p>
        <button onClick={handleGoHome} className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full bg-[#171611] px-5 py-3 text-sm font-semibold text-[#fffdf8] transition hover:bg-[#2b2922]"><ArrowLeft size={16} /> Volver a la consulta</button>
      </section>
    </main>
  );
}
