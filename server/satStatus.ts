import { z } from "zod";

const SAT_ENDPOINT = "https://consultaqr.facturaelectronica.sat.gob.mx/ConsultaCFDIService.svc";
const SOAP_ACTION = "http://tempuri.org/IConsultaCFDIService/Consulta";
const MAX_RESPONSE_BYTES = 256 * 1024;
const ACUSE_FIELDS = ["CodigoEstatus", "Estado", "EsCancelable", "EstatusCancelacion", "ValidacionEFOS"] as const;

const normalize = (value: string) => value.trim().toUpperCase();

export const satStatusInput = z.object({
  issuerRfc: z.string().trim().regex(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i, "El RFC emisor no tiene un formato válido.").transform(normalize),
  receiverRfc: z.string().trim().regex(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i, "El RFC receptor no tiene un formato válido.").transform(normalize),
  total: z
    .string()
    .trim()
    .regex(/^\d{1,18}(?:\.\d{1,6})?$/, "El total debe ser un importe decimal sin separadores de miles.")
    .refine(value => Number(value) > 0, "El total debe ser mayor que cero."),
  uuid: z.string().trim().uuid("El UUID no tiene un formato válido.").transform(normalize),
  sealLast8: z
    .string()
    .trim()
    .length(8, "Ingresa exactamente los ocho últimos caracteres del sello.")
    .refine(value => !/\s/.test(value), "Los últimos ocho caracteres del sello no pueden contener espacios."),
});

export type SatStatusInput = z.infer<typeof satStatusInput>;
export const satStatusRawInput = z.object({
  issuerRfc: z.string(),
  receiverRfc: z.string(),
  total: z.string(),
  uuid: z.string(),
  sealLast8: z.string(),
});
export type SatStatusRawInput = z.infer<typeof satStatusRawInput>;

type Acuse = Record<(typeof ACUSE_FIELDS)[number], string | null>;

export type SatStatusResult =
  | { ok: true; httpStatus: number; acuse: Acuse }
  | { ok: false; code: "network_error" | "http_error" | "soap_fault" | "invalid_soap_response" | "empty_acuse"; httpStatus?: number };

export type SatStatusResponse = SatStatusResult | {
  ok: false;
  code: "validation_error";
  fieldErrors: Partial<Record<keyof SatStatusRawInput, string[] | undefined>>;
};

function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, character => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[character]!);
}

function decodeXml(value: string) {
  return value.replace(/&(amp|lt|gt|quot|apos);/g, (_match, entity: string) => ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" })[entity]!);
}

function elementText(xml: string, field: string) {
  const match = xml.match(new RegExp(`<(?:(?:[\\w-]+):)?${field}\\b[^>]*>([\\s\\S]*?)</(?:(?:[\\w-]+):)?${field}>`, "i"));
  return match ? decodeXml(match[1].replace(/<[^>]+>/g, "").trim()) : null;
}

export function buildPrintedExpression(input: SatStatusInput) {
  return `?${new URLSearchParams({ re: input.issuerRfc, rr: input.receiverRfc, tt: input.total, id: input.uuid, fe: input.sealLast8 }).toString()}`;
}

export function buildSoapBody(expression: string) {
  return `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><Consulta xmlns="http://tempuri.org/"><expresionImpresa>${escapeXml(expression)}</expresionImpresa></Consulta></soap:Body></soap:Envelope>`;
}

function parseAcuse(xml: string): SatStatusResult {
  if (elementText(xml, "Fault")) return { ok: false, code: "soap_fault" };
  const result = xml.match(/<(?:(?:[\w-]+):)?ConsultaResult\b[^>]*>([\s\S]*?)<\/(?:(?:[\w-]+):)?ConsultaResult>/i);
  if (!result) return { ok: false, code: "empty_acuse" };

  const acuse = Object.fromEntries(ACUSE_FIELDS.map(field => [field, elementText(result[1], field)])) as Acuse;
  if (Object.values(acuse).every(value => value === null)) return { ok: false, code: "empty_acuse" };
  return { ok: true, httpStatus: 200, acuse };
}

export async function querySatStatus(input: SatStatusInput): Promise<SatStatusResult> {
  const expression = buildPrintedExpression(input);
  try {
    const response = await fetch(SAT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/xml; charset=utf-8", SOAPAction: SOAP_ACTION },
      body: buildSoapBody(expression),
      signal: AbortSignal.timeout(15_000),
    });
    const payload = await response.arrayBuffer();
    if (payload.byteLength > MAX_RESPONSE_BYTES) return { ok: false, code: "invalid_soap_response", httpStatus: response.status };

    const parsed = parseAcuse(new TextDecoder().decode(payload));
    if (!response.ok) return parsed.ok || parsed.code !== "soap_fault" ? { ok: false, code: "http_error", httpStatus: response.status } : { ...parsed, httpStatus: response.status };
    return parsed.ok ? { ...parsed, httpStatus: response.status } : { ...parsed, httpStatus: response.status };
  } catch {
    return { ok: false, code: "network_error" };
  }
}

export async function runSatStatus(input: SatStatusRawInput): Promise<SatStatusResponse> {
  const parsed = satStatusInput.safeParse(input);
  if (!parsed.success) return { ok: false, code: "validation_error", fieldErrors: parsed.error.flatten().fieldErrors };
  return querySatStatus(parsed.data);
}
