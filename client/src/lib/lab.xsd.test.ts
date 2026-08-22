import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { XmlBufferInputProvider, XmlDocument, XsdValidator, xmlCleanupInputProvider, xmlRegisterInputProvider } from "libxml2-wasm";

const root = process.cwd();
const read = (path: string) => readFile(join(root, path), "utf8");

describe("perfil XSD CFDI 4.0 migrado", () => {
  it("acepta y rechaza los fixtures estructurales del laboratorio sin red", async () => {
    const [schema, catalog, types, valid, invalid] = await Promise.all([
      read("lab/schemas/cfdi40/cfdv40.xsd"),
      read("lab/schemas/cfdi40/catCFDI.xsd"),
      read("lab/schemas/cfdi40/tdCFDI.xsd"),
      read("lab/fixtures/xsd/cfdi40-xsd-valid.xml"),
      read("lab/fixtures/xsd/cfdi40-xsd-invalid.xml"),
    ]);
    xmlRegisterInputProvider(new XmlBufferInputProvider({ "catCFDI.xsd": new TextEncoder().encode(catalog), "tdCFDI.xsd": new TextEncoder().encode(types) }));
    const xsd = XmlDocument.fromString(schema, { url: "cfdv40.xsd" }); const validator = XsdValidator.fromDoc(xsd);
    const validDocument = XmlDocument.fromString(valid, { url: "valid.xml" }); expect(() => validator.validate(validDocument)).not.toThrow(); validDocument.dispose();
    const invalidDocument = XmlDocument.fromString(invalid, { url: "invalid.xml" }); expect(() => validator.validate(invalidDocument)).toThrow(); invalidDocument.dispose();
    validator.dispose(); xsd.dispose(); xmlCleanupInputProvider();
  });
});
