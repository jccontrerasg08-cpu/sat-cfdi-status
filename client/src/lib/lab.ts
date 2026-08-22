import mainSchema from "../../../lab/schemas/cfdi40/cfdv40.xsd?raw";
import catalogSchema from "../../../lab/schemas/cfdi40/catCFDI.xsd?raw";
import typesSchema from "../../../lab/schemas/cfdi40/tdCFDI.xsd?raw";

export type LabIssue = { code: string; rule: string; message: string; fragment: string };
export type LabReport = { root: string; issues: LabIssue[] };
export type SyntheticCustomsQuote = { ok: true; scope: "synthetic_local_only"; currency: "MXN"; customsValue: string; exchangeRate: string; breakdown: { igi: string; dta: string; ivaBase: string; iva: string; prv: string }; totalContributions: string; note: string };

type XmlElement = Pick<Element, "localName" | "tagName" | "getAttribute" | "children">;
type Decimal = { units: bigint; scale: number };

export const LAB_CATALOG = {
  scope: "fixtures_sinteticos_locales",
  roots: ["Comprobante", "FixtureLedgerCatalog", "FixtureTrialBalance", "FixtureJournal", "FixtureTradeShipment"],
  ruleCodes: ["xml_parse_error", "unexpected_root", "required_attribute_missing", "fecha_invalid", "fecha_inconsistent", "uuid_missing", "unsupported_complement", "ledger_account_missing_field", "ledger_account_duplicate", "ledger_amount_invalid", "ledger_balance_inconsistent", "journal_entry_missing_line", "journal_amount_invalid", "journal_entry_unbalanced", "trade_shipment_missing_line", "trade_line_missing_field", "trade_line_amount_invalid", "trade_declared_total_invalid", "trade_declared_total_inconsistent"],
} as const;

const requiredComprobante = ["Version", "Fecha", "SubTotal", "Total", "Moneda", "TipoDeComprobante", "Exportacion", "MetodoPago", "FormaPago", "LugarExpedicion"];
const issue = (code: string, rule: string, message: string, fragment: string): LabIssue => ({ code, rule, message, fragment });
const name = (element: XmlElement) => element.localName || element.tagName.split("}").pop() || element.tagName;
const children = (element: XmlElement, expected: string) => Array.from(element.children).filter(child => name(child) === expected) as XmlElement[];

function decimal(raw: string | null): Decimal | null {
  if (!raw || !/^[+-]?\d+(?:\.\d+)?$/.test(raw)) return null;
  const negative = raw.startsWith("-");
  const [whole, fraction = ""] = raw.replace(/^[+-]/, "").split(".");
  return { units: BigInt(`${negative ? "-" : ""}${whole}${fraction}`), scale: fraction.length };
}

function align(value: Decimal, scale: number) { return value.units * BigInt(10) ** BigInt(scale - value.scale); }
function same(left: Decimal, right: Decimal) { const scale = Math.max(left.scale, right.scale); return align(left, scale) === align(right, scale); }
function sum(values: Decimal[]) { const scale = Math.max(0, ...values.map(value => value.scale)); return { units: values.reduce((total, value) => total + align(value, scale), BigInt(0)), scale }; }
function add(left: Decimal, right: Decimal) { const scale = Math.max(left.scale, right.scale); return { units: align(left, scale) + align(right, scale), scale }; }
function subtract(left: Decimal, right: Decimal) { const scale = Math.max(left.scale, right.scale); return { units: align(left, scale) - align(right, scale), scale }; }
function multiply(left: Decimal, right: Decimal) { return { units: left.units * right.units, scale: left.scale + right.scale }; }
function roundedMoney(value: Decimal) { const target = 2; const rounded = value.scale <= target ? value.units * BigInt(10) ** BigInt(target - value.scale) : (() => { const factor = BigInt(10) ** BigInt(value.scale - target); const quotient = value.units / factor; const remainder = value.units % factor; return remainder * BigInt(2) >= factor ? quotient + BigInt(1) : quotient; })(); const sign = rounded < BigInt(0) ? "-" : ""; const digits = (rounded < BigInt(0) ? -rounded : rounded).toString().padStart(3, "0"); return `${sign}${digits.slice(0, -2)}.${digits.slice(-2)}`; }

export function syntheticCustomsQuote(valorUsd: string, exchangeRate: string): SyntheticCustomsQuote {
  const usd = decimal(valorUsd); const exchange = decimal(exchangeRate);
  if (!usd || usd.units <= BigInt(0)) throw new Error("valor_usd debe ser un decimal positivo.");
  if (!exchange || exchange.units <= BigInt(0)) throw new Error("tipo_cambio debe ser un decimal positivo.");
  const customs = multiply(usd, exchange); const igi = { units: BigInt(0), scale: 0 }; const dta = multiply(customs, { units: BigInt(8), scale: 3 }); const ivaBase = add(add(customs, igi), dta); const iva = multiply(ivaBase, { units: BigInt(16), scale: 2 }); const prv = { units: BigInt(290), scale: 0 }; const total = add(add(igi, dta), add(prv, iva));
  return { ok: true, scope: "synthetic_local_only", currency: "MXN", customsValue: roundedMoney(customs), exchangeRate: roundedMoney(exchange), breakdown: { igi: roundedMoney(igi), dta: roundedMoney(dta), ivaBase: roundedMoney(ivaBase), iva: roundedMoney(iva), prv: roundedMoney(prv) }, totalContributions: roundedMoney(total), note: "Modelo sintético local; no es una determinación fiscal ni aduanera oficial." };
}

function comprobante(root: XmlElement) {
  const issues = requiredComprobante.filter(attribute => !root.getAttribute(attribute)).map(attribute => issue("required_attribute_missing", "comprobante_required_attributes", `Falta el atributo requerido de laboratorio: ${attribute}.`, `<Comprobante ${attribute}=...>`));
  const version = root.getAttribute("Version"); const fecha = root.getAttribute("Fecha");
  if (version === "4.0" && fecha) {
    const parsed = Date.parse(fecha);
    if (Number.isNaN(parsed)) issues.push(issue("fecha_invalid", "fecha_iso8601", "Fecha no usa un formato ISO 8601 legible por el laboratorio.", `Fecha="${fecha}"`));
    else if (new Date(parsed) < new Date("2022-01-01T00:00:00Z")) issues.push(issue("fecha_inconsistent", "version_4_date_window", "La fecha es anterior a la ventana educativa usada para Version 4.0.", `Version="${version}" Fecha="${fecha}"`));
  }
  const complementos = Array.from(root.children).filter(child => name(child) === "Complemento") as XmlElement[];
  complementos.flatMap(complemento => Array.from(complemento.children) as XmlElement[]).forEach(child => {
    if (name(child) === "TimbreFiscalDigital" && !child.getAttribute("UUID")) issues.push(issue("uuid_missing", "timbre_uuid_present", "El TimbreFiscalDigital sintético no contiene UUID.", "<TimbreFiscalDigital UUID=...>"));
    if (name(child) !== "TimbreFiscalDigital") issues.push(issue("unsupported_complement", "supported_complements", `El complemento ${name(child)} está fuera del alcance del laboratorio.`, `<${name(child)}>`));
  });
  return issues;
}

function ledger(root: XmlElement) {
  const issues: LabIssue[] = []; const ids = new Set<string>();
  children(root, "Account").forEach(account => { const id = account.getAttribute("id"); const accountName = account.getAttribute("name"); if (!id || !accountName) { const missing = id ? "name" : "id"; issues.push(issue("ledger_account_missing_field", "ledger_account_identity", `La cuenta sintética no contiene ${missing}.`, `<Account ${missing}=...>`)); return; } if (ids.has(id)) issues.push(issue("ledger_account_duplicate", "ledger_account_identity", "El identificador de cuenta sintética se repite.", `Account id="${id}"`)); ids.add(id); });
  return issues;
}

function trialBalance(root: XmlElement) {
  const issues: LabIssue[] = [];
  children(root, "Account").forEach(account => { const values = ["opening", "debits", "credits", "closing"].map(attribute => [attribute, decimal(account.getAttribute(attribute))] as const); values.forEach(([attribute, value]) => { if (!value) issues.push(issue("ledger_amount_invalid", "ledger_decimal_amounts", `El importe sintético ${attribute} debe ser decimal y finito.`, `<Account ${attribute}=...>`)); }); const map = Object.fromEntries(values); if (map.opening && map.debits && map.credits && map.closing && !same(map.closing, subtract(add(map.opening, map.debits), map.credits))) issues.push(issue("ledger_balance_inconsistent", "ledger_balance_identity", "El saldo final sintético no coincide con apertura + cargos - abonos.", `Account id="${account.getAttribute("id") || "..."}"`)); });
  return issues;
}

function journal(root: XmlElement) {
  const issues: LabIssue[] = [];
  children(root, "Entry").forEach((entry, index) => { const lines = children(entry, "Line"); if (!lines.length) { issues.push(issue("journal_entry_missing_line", "journal_entry_lines", "El asiento sintético no contiene líneas.", `Entry ${index + 1}`)); return; } const debits: Decimal[] = []; const credits: Decimal[] = []; let invalid = false; lines.forEach(line => (["debit", "credit"] as const).forEach(attribute => { const value = decimal(line.getAttribute(attribute)); if (!value) { invalid = true; issues.push(issue("journal_amount_invalid", "journal_decimal_amounts", `El importe sintético ${attribute} debe ser decimal y finito.`, `<Line ${attribute}=...>`)); } else (attribute === "debit" ? debits : credits).push(value); })); if (!invalid && !same(sum(debits), sum(credits))) issues.push(issue("journal_entry_unbalanced", "journal_entry_balance", "Los cargos y abonos sintéticos del asiento no coinciden.", `Entry ${index + 1}`)); });
  return issues;
}

function shipment(root: XmlElement) {
  const lines = children(root, "Line"); if (!lines.length) return [issue("trade_shipment_missing_line", "trade_shipment_lines", "El envío sintético no contiene líneas.", "<FixtureTradeShipment>")];
  const issues: LabIssue[] = []; let expected: Decimal = { units: BigInt(0), scale: 0 }; let invalid = false;
  lines.forEach((line, index) => { ["product_id", "origin", "destination"].forEach(attribute => { if (!line.getAttribute(attribute)) issues.push(issue("trade_line_missing_field", "trade_line_identity", `La línea sintética no contiene ${attribute}.`, `<Line ${attribute}=...>`)); }); const quantity = decimal(line.getAttribute("quantity")); const unitValue = decimal(line.getAttribute("unit_value")); if (!quantity || quantity.units <= BigInt(0)) { invalid = true; issues.push(issue("trade_line_amount_invalid", "trade_line_decimal_amounts", "quantity debe ser decimal finito y mayor que cero.", `Line ${index + 1} quantity=...`)); } if (!unitValue || unitValue.units < BigInt(0)) { invalid = true; issues.push(issue("trade_line_amount_invalid", "trade_line_decimal_amounts", "unit_value debe ser decimal finito y no negativo.", `Line ${index + 1} unit_value=...`)); } if (quantity && quantity.units > BigInt(0) && unitValue && unitValue.units >= BigInt(0)) expected = add(expected, multiply(quantity, unitValue)); });
  const declared = decimal(root.getAttribute("declared_total")); if (!declared || declared.units < BigInt(0)) issues.push(issue("trade_declared_total_invalid", "trade_declared_total_decimal", "declared_total debe ser decimal finito y no negativo.", "<FixtureTradeShipment declared_total=...>")); else if (!invalid && !same(declared, expected)) issues.push(issue("trade_declared_total_inconsistent", "trade_declared_total_identity", "El total declarado sintético no coincide con la suma de quantity × unit_value.", `declared_total="${root.getAttribute("declared_total")}"`));
  return issues;
}

export function validateLabElements(root: XmlElement): LabReport {
  const rootName = name(root); const issues = rootName === "Comprobante" ? comprobante(root) : rootName === "FixtureLedgerCatalog" ? ledger(root) : rootName === "FixtureTrialBalance" ? trialBalance(root) : rootName === "FixtureJournal" ? journal(root) : rootName === "FixtureTradeShipment" ? shipment(root) : [issue("unexpected_root", "root_is_comprobante", "La raíz no corresponde a un fixture entendido por este laboratorio.", root.tagName)];
  return { root: rootName, issues };
}

export function validateLabXml(xml: string) {
  if (xml.length > 2_000_000) throw new Error("El XML supera el tamaño permitido para la lectura local.");
  const document = new DOMParser().parseFromString(xml, "application/xml"); if (document.querySelector("parsererror")) throw new Error("El archivo no contiene un XML válido.");
  return validateLabElements(document.documentElement);
}

export async function validateCfdi40Xsd(xml: string) {
  const { XmlBufferInputProvider, XmlDocument, XsdValidator, xmlCleanupInputProvider, xmlRegisterInputProvider } = await import("libxml2-wasm");
  const encode = new TextEncoder();
  let schema: InstanceType<typeof XmlDocument> | undefined;
  let validator: InstanceType<typeof XsdValidator> | undefined;
  try {
    xmlRegisterInputProvider(new XmlBufferInputProvider({ "catCFDI.xsd": encode.encode(catalogSchema), "tdCFDI.xsd": encode.encode(typesSchema) }));
    schema = XmlDocument.fromString(mainSchema, { url: "cfdv40.xsd" });
    validator = XsdValidator.fromDoc(schema);
    const document = XmlDocument.fromString(xml, { url: "comprobante.xml" });
    try { validator.validate(document); return { valid: true, errors: [] }; } finally { document.dispose(); }
  } catch (error) {
    return { valid: false, errors: [{ message: error instanceof Error ? error.message : "No fue posible validar el XSD local.", line: null }] };
  } finally {
    validator?.dispose(); schema?.dispose(); xmlCleanupInputProvider();
  }
}
