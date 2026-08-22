import { describe, expect, it, vi } from "vitest";
import { normalizeXml, PUBLIC_CFDI_EXAMPLE, syntheticCustomsQuote, validateLabElements } from "./lab";

const node = (localName: string, attributes: Record<string, string> = {}, children: ReturnType<typeof node>[] = []) => ({ localName, tagName: localName, getAttribute: (key: string) => attributes[key] ?? null, children });

describe("laboratorio educativo migrado", () => {
  it("conserva la identidad aritmética exacta de una balanza sintética", () => {
    const report = validateLabElements(node("FixtureTrialBalance", {}, [node("Account", { id: "1", opening: "0.1", debits: "0.2", credits: "0", closing: "0.3" })]));
    expect(report.issues).toEqual([]);
  });

  it("detecta un asiento sintético desbalanceado con el código estable", () => {
    const report = validateLabElements(node("FixtureJournal", {}, [node("Entry", {}, [node("Line", { debit: "100", credit: "0" })]) ]));
    expect(report.issues).toMatchObject([{ code: "journal_entry_unbalanced", fragment: "Entry 1" }]);
  });

  it("mantiene el rechazo de raíces ajenas al laboratorio", () => {
    expect(validateLabElements(node("Otro"))).toMatchObject({ issues: [{ code: "unexpected_root" }] });
  });

  it("mantiene el contrato de la cotización aduanera sintética", () => {
    expect(syntheticCustomsQuote("100", "20")).toMatchObject({ customsValue: "2000.00", totalContributions: "628.56", breakdown: { dta: "16.00", iva: "322.56", prv: "290.00" } });
  });

  it("normaliza únicamente XML válido y conserva la fuente pública como referencia externa", () => {
    class Parser { parseFromString() { return { querySelector: () => null }; } }
    class Serializer { serializeToString() { return "<cfdi:Comprobante/>"; } }
    vi.stubGlobal("DOMParser", Parser); vi.stubGlobal("XMLSerializer", Serializer);
    expect(normalizeXml("<cfdi:Comprobante/>")).toBe("<cfdi:Comprobante/>");
    expect(PUBLIC_CFDI_EXAMPLE.url).toMatch(/^https:\/\//);
    vi.unstubAllGlobals();
  });

  it("rechaza XML malformado antes de intentar normalizarlo", () => {
    class Parser { parseFromString() { return { querySelector: () => ({}) }; } }
    vi.stubGlobal("DOMParser", Parser);
    expect(() => normalizeXml("<Comprobante>")).toThrow("El XML no puede normalizarse porque no es válido.");
    vi.unstubAllGlobals();
  });
});
