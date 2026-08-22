export type CfdiQuery = {
  issuerRfc: string;
  receiverRfc: string;
  total: string;
  uuid: string;
  sealLast8: string;
};

export type CfdiPreview = {
  version: string | null;
  series: string | null;
  folio: string | null;
  issueDate: string | null;
  currency: string | null;
  documentType: string | null;
  subtotal: string | null;
  discount: string | null;
};

export type CfdiHistoryEntry = {
  id: string;
  savedAt: number;
  query: CfdiQuery;
  preview: CfdiPreview;
  acuse: Record<string, string | null>;
};

type XmlElement = Pick<Element, "localName" | "getAttribute">;

export const CFDI_HISTORY_KEY = "consulta-cfdi.history.v1";
const HISTORY_LIMIT = 8;

const textAttribute = (element: XmlElement | undefined, attribute: string) => element?.getAttribute(attribute)?.trim() || null;
const findElement = (elements: XmlElement[], localName: string) => elements.find(element => element.localName === localName);

export function extractCfdiElements(elements: XmlElement[]) {
  const comprobante = findElement(elements, "Comprobante");
  const emisor = findElement(elements, "Emisor");
  const receptor = findElement(elements, "Receptor");
  const timbre = findElement(elements, "TimbreFiscalDigital");
  const sello = textAttribute(comprobante, "Sello");

  const values = {
    issuerRfc: textAttribute(emisor, "Rfc"),
    receiverRfc: textAttribute(receptor, "Rfc"),
    total: textAttribute(comprobante, "Total"),
    uuid: textAttribute(timbre, "UUID"),
    sealLast8: sello?.slice(-8).toUpperCase() || null,
  };
  const missing = Object.entries(values).filter(([, value]) => !value).map(([name]) => name);
  if (missing.length) throw new Error(`El XML no contiene ${missing.join(", ")}.`);

  return {
    query: values as CfdiQuery,
    preview: {
      version: textAttribute(comprobante, "Version"),
      series: textAttribute(comprobante, "Serie"),
      folio: textAttribute(comprobante, "Folio"),
      issueDate: textAttribute(comprobante, "Fecha"),
      currency: textAttribute(comprobante, "Moneda"),
      documentType: textAttribute(comprobante, "TipoDeComprobante"),
      subtotal: textAttribute(comprobante, "SubTotal"),
      discount: textAttribute(comprobante, "Descuento"),
    } satisfies CfdiPreview,
  };
}

export function extractCfdiXml(xml: string) {
  if (xml.length > 2_000_000) throw new Error("El XML supera el tamaño permitido para la lectura local.");
  const document = new DOMParser().parseFromString(xml, "application/xml");
  if (document.querySelector("parsererror")) throw new Error("El archivo no contiene un XML válido.");
  return extractCfdiElements(Array.from(document.getElementsByTagName("*")));
}

export function readHistory(raw: string | null): CfdiHistoryEntry[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(entry => entry && typeof entry.id === "string" && entry.query && entry.preview && entry.acuse).slice(0, HISTORY_LIMIT) : [];
  } catch {
    return [];
  }
}

export function mergeHistory(entries: CfdiHistoryEntry[], entry: CfdiHistoryEntry) {
  return [entry, ...entries.filter(item => item.query.uuid !== entry.query.uuid)].slice(0, HISTORY_LIMIT);
}
