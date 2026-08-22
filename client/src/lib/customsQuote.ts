export type SyntheticCustomsQuote = { ok: true; scope: "synthetic_local_only"; currency: "MXN"; customsValue: string; exchangeRate: string; breakdown: { igi: string; dta: string; ivaBase: string; iva: string; prv: string }; totalContributions: string; note: string };

type Decimal = { units: bigint; scale: number };

function decimal(raw: string | null): Decimal | null {
  if (!raw || !/^[+-]?\d+(?:\.\d+)?$/.test(raw)) return null;
  const negative = raw.startsWith("-");
  const [whole, fraction = ""] = raw.replace(/^[+-]/, "").split(".");
  return { units: BigInt(`${negative ? "-" : ""}${whole}${fraction}`), scale: fraction.length };
}

function align(value: Decimal, scale: number) { return value.units * BigInt(10) ** BigInt(scale - value.scale); }
function add(left: Decimal, right: Decimal) { const scale = Math.max(left.scale, right.scale); return { units: align(left, scale) + align(right, scale), scale }; }
function multiply(left: Decimal, right: Decimal) { return { units: left.units * right.units, scale: left.scale + right.scale }; }
function roundedMoney(value: Decimal) { const target = 2; const rounded = value.scale <= target ? value.units * BigInt(10) ** BigInt(target - value.scale) : (() => { const factor = BigInt(10) ** BigInt(value.scale - target); const quotient = value.units / factor; const remainder = value.units % factor; return remainder * BigInt(2) >= factor ? quotient + BigInt(1) : quotient; })(); const sign = rounded < BigInt(0) ? "-" : ""; const digits = (rounded < BigInt(0) ? -rounded : rounded).toString().padStart(3, "0"); return `${sign}${digits.slice(0, -2)}.${digits.slice(-2)}`; }

export function syntheticCustomsQuote(valorUsd: string, exchangeRate: string): SyntheticCustomsQuote {
  const usd = decimal(valorUsd); const exchange = decimal(exchangeRate);
  if (!usd || usd.units <= BigInt(0)) throw new Error("valor_usd debe ser un decimal positivo.");
  if (!exchange || exchange.units <= BigInt(0)) throw new Error("tipo_cambio debe ser un decimal positivo.");
  const customs = multiply(usd, exchange); const igi = { units: BigInt(0), scale: 0 }; const dta = multiply(customs, { units: BigInt(8), scale: 3 }); const ivaBase = add(add(customs, igi), dta); const iva = multiply(ivaBase, { units: BigInt(16), scale: 2 }); const prv = { units: BigInt(290), scale: 0 }; const total = add(add(igi, dta), add(prv, iva));
  return { ok: true, scope: "synthetic_local_only", currency: "MXN", customsValue: roundedMoney(customs), exchangeRate: roundedMoney(exchange), breakdown: { igi: roundedMoney(igi), dta: roundedMoney(dta), ivaBase: roundedMoney(ivaBase), iva: roundedMoney(iva), prv: roundedMoney(prv) }, totalContributions: roundedMoney(total), note: "Modelo sintético local; no es una determinación fiscal ni aduanera oficial." };
}
