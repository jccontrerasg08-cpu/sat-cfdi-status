import { describe, expect, it, vi } from "vitest";
import { extractCfdiElements, extractCfdiXml, mergeHistory, readHistory, type CfdiHistoryEntry } from "./cfdi";

const element = (localName: string, attributes: Record<string, string>) => ({ localName, getAttribute: (name: string) => attributes[name] ?? null });

const entry = (uuid: string, savedAt = 1): CfdiHistoryEntry => ({
  id: `${uuid}:${savedAt}`,
  savedAt,
  query: { issuerRfc: "AAA010101AAA", receiverRfc: "XAXX010101000", total: "100.00", uuid, sealLast8: "ABC12345" },
  preview: { version: "4.0", series: "A", folio: "1", issueDate: null, currency: "MXN", documentType: "I", subtotal: "100.00", discount: null },
  acuse: { Estado: "Vigente" },
});

describe("lectura local de CFDI", () => {
  it("extrae los cinco datos de consulta y los últimos ocho del sello", () => {
    expect(extractCfdiElements([
      element("Comprobante", { Total: "100.00", Sello: "0123456789ABCDEF", Version: "4.0" }),
      element("Emisor", { Rfc: "AAA010101AAA" }),
      element("Receptor", { Rfc: "XAXX010101000" }),
      element("TimbreFiscalDigital", { UUID: "123E4567-E89B-12D3-A456-426614174000" }),
    ])).toMatchObject({ query: { issuerRfc: "AAA010101AAA", receiverRfc: "XAXX010101000", total: "100.00", uuid: "123E4567-E89B-12D3-A456-426614174000", sealLast8: "89ABCDEF" } });
  });

  it("rechaza un XML sin el TimbreFiscalDigital necesario para la consulta", () => {
    expect(() => extractCfdiElements([element("Comprobante", { Total: "100.00", Sello: "0123456789ABCDEF" }), element("Emisor", { Rfc: "AAA010101AAA" }), element("Receptor", { Rfc: "XAXX010101000" })])).toThrow("uuid");
  });

  it("lee un XML CFDI completo y prepara los datos de la vista previa", () => {
    const elements = [
      element("Comprobante", { Total: "116.00", Sello: "00000000ABCDEF12", Version: "4.0", Serie: "A", Folio: "42", Fecha: "2026-08-22T12:00:00", Moneda: "MXN", TipoDeComprobante: "I", SubTotal: "100.00", Descuento: "0.00" }),
      element("Emisor", { Rfc: "AAA010101AAA" }),
      element("Receptor", { Rfc: "XAXX010101000" }),
      element("TimbreFiscalDigital", { UUID: "123E4567-E89B-12D3-A456-426614174000" }),
    ];
    class Parser { parseFromString() { return { querySelector: () => null, getElementsByTagName: () => elements }; } }
    vi.stubGlobal("DOMParser", Parser);

    expect(extractCfdiXml(`<?xml version="1.0"?><cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4" Version="4.0"><cfdi:Emisor Rfc="AAA010101AAA"/><cfdi:Receptor Rfc="XAXX010101000"/><cfdi:Complemento><tfd:TimbreFiscalDigital UUID="123E4567-E89B-12D3-A456-426614174000"/></cfdi:Complemento></cfdi:Comprobante>`)).toMatchObject({
      query: { total: "116.00", sealLast8: "ABCDEF12" },
      preview: { version: "4.0", series: "A", folio: "42", issueDate: "2026-08-22T12:00:00", currency: "MXN", documentType: "I", subtotal: "100.00", discount: "0.00" },
    });
    vi.unstubAllGlobals();
  });

  it("comunica un XML malformado antes de intentar extraer datos", () => {
    class Parser { parseFromString() { return { querySelector: () => ({}) }; } }
    vi.stubGlobal("DOMParser", Parser);
    expect(() => extractCfdiXml("<cfdi:Comprobante")).toThrow("XML válido");
    vi.unstubAllGlobals();
  });

  it("mantiene un historial local acotado y sustituye consultas del mismo UUID", () => {
    const entries = Array.from({ length: 8 }, (_, index) => entry(`uuid-${index}`, index));
    const merged = mergeHistory(entries, entry("uuid-3", 99));
    expect(merged).toHaveLength(8);
    expect(merged[0].savedAt).toBe(99);
    expect(merged.filter(item => item.query.uuid === "uuid-3")).toHaveLength(1);
    expect(readHistory("{invalido")).toEqual([]);
  });
});
