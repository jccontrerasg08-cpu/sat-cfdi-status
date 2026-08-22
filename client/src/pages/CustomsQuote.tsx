import { syntheticCustomsQuote, type SyntheticCustomsQuote } from "@/lib/customsQuote";
import { ArrowLeft, Calculator, CircleAlert } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function CustomsQuote() {
  const [usd, setUsd] = useState("100");
  const [rate, setRate] = useState("20");
  const [result, setResult] = useState<SyntheticCustomsQuote | null>(null);
  const [error, setError] = useState<string | null>(null);

  const quote = () => {
    try {
      setResult(syntheticCustomsQuote(usd, rate));
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No fue posible calcular.");
    }
  };

  return <main className="min-h-screen bg-[#f5f1e8] px-5 py-8 text-[#171611] sm:px-8 lg:px-12"><div className="mx-auto max-w-3xl"><Link href="/laboratorio" className="inline-flex items-center gap-2 text-sm font-semibold text-[#9b571f]"><ArrowLeft size={16} /> Volver al laboratorio</Link><section className="mt-10 rounded-[2rem] border border-[#d9d2c4] bg-[#fffdf8] p-6 shadow-[0_24px_80px_rgba(56,40,21,0.10)] sm:p-10"><div className="flex gap-4"><span className="grid h-11 w-11 place-items-center rounded-full bg-[#efe2d1] text-[#b76421]"><Calculator size={21} /></span><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#b76421]">Ejercicio educativo local</p><h1 className="mt-2 font-[var(--font-display)] text-4xl tracking-[-.05em]">Cotización aduanera sintética</h1></div></div><p className="mt-5 max-w-2xl leading-7 text-[#696459]">Replica el modelo del laboratorio para explicar una identidad aritmética simple. No calcula contribuciones oficiales ni sirve para una operación real.</p><div className="mt-8 grid gap-5 sm:grid-cols-2"><div><label htmlFor="customs-usd" className="text-sm font-semibold">Valor USD</label><input id="customs-usd" value={usd} onChange={event => setUsd(event.target.value)} inputMode="decimal" className="mt-2 h-12 w-full rounded-xl border border-[#d8d0c2] bg-white px-3 font-mono outline-none focus:border-[#b76421]" /></div><div><label htmlFor="customs-rate" className="text-sm font-semibold">Tipo de cambio</label><input id="customs-rate" value={rate} onChange={event => setRate(event.target.value)} inputMode="decimal" className="mt-2 h-12 w-full rounded-xl border border-[#d8d0c2] bg-white px-3 font-mono outline-none focus:border-[#b76421]" /></div></div><button onClick={quote} className="mt-6 rounded-full bg-[#171611] px-5 py-3 text-sm font-semibold text-white">Calcular modelo sintético</button>{error && <p role="alert" className="mt-5 flex gap-2 rounded-xl bg-[#fde6de] p-4 text-sm text-[#9e352c]"><CircleAlert size={18} />{error}</p>}{result && <section className="mt-7 rounded-2xl bg-[#f4eee4] p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#777164]">Resultado educativo · MXN</p><dl className="mt-4 grid gap-4 sm:grid-cols-2"><Item label="Valor en aduana" value={result.customsValue} /><Item label="DTA" value={result.breakdown.dta} /><Item label="Base IVA" value={result.breakdown.ivaBase} /><Item label="IVA" value={result.breakdown.iva} /><Item label="PRV" value={result.breakdown.prv} /><Item label="Total sintético" value={result.totalContributions} /></dl><p className="mt-5 text-xs leading-5 text-[#777164]">{result.note}</p></section>}</section></div></main>;
}

function Item({ label, value }: { label: string; value: string }) { return <div><dt className="text-xs font-bold uppercase tracking-[.12em] text-[#6f685c]">{label}</dt><dd className="mt-1 text-lg font-semibold">{value}</dd></div>; }
