import { readFile } from "node:fs/promises";
import { XmlBufferInputProvider, XmlDocument, XsdValidator, xmlCleanupInputProvider, xmlRegisterInputProvider } from "libxml2-wasm";

const [xmlPath] = process.argv.slice(2);
if (!xmlPath) throw new Error("Uso: node scripts/validate-public-cfdi-example.mjs <archivo.xml>");
const load = path => readFile(new URL(`../${path}`, import.meta.url));
const [main, catalog, types, xml] = await Promise.all([
  load("lab/schemas/cfdi40/cfdv40.xsd"),
  load("lab/schemas/cfdi40/catCFDI.xsd"),
  load("lab/schemas/cfdi40/tdCFDI.xsd"),
  readFile(xmlPath),
]);
xmlRegisterInputProvider(new XmlBufferInputProvider({ "catCFDI.xsd": catalog, "tdCFDI.xsd": types }));
const schema = XmlDocument.fromBuffer(main, { url: "cfdv40.xsd" });
const validator = XsdValidator.fromDoc(schema);
const document = XmlDocument.fromBuffer(xml, { url: "public-example.xml" });
validator.validate(document);
document.dispose();
validator.dispose();
schema.dispose();
xmlCleanupInputProvider();
console.log("Ejemplo público aceptado por el perfil XSD CFDI 4.0 local.");
