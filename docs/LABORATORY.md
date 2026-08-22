# Laboratorio educativo local

La ruta `/laboratorio` conserva los fixtures sintéticos, las reglas didácticas y el perfil XSD CFDI 4.0 que pertenecían a `cfdi-fixture-lab`. Opera en el navegador: el XML no se transmite, no se conserva y no participa en la consulta operativa del SAT.

| Activo migrado | Ubicación | Uso |
|---|---|---|
| Fixtures XML sintéticos | `lab/fixtures/` | Casos de demostración y regresión local. |
| Esquemas CFDI 4.0 y manifiesto | `lab/schemas/cfdi40/` | Validación XSD offline mediante `libxml2-wasm`. |
| Guías del laboratorio | `docs/lab/` | Reglas, contratos JSON Lines, fixtures y límites. |
| Motor de reglas | `client/src/lib/lab.ts` | Catálogo, balanza, diario, envío y comprobante sintético. |
| Utilidades históricas de evaluación | `docs/lab/legacy-tools/` | Fuente y fixtures de evaluación preservados; no forman parte del runtime publicado. |

La validación XSD utiliza `libxml2-wasm`, una adaptación de libxml2 a WebAssembly que funciona sin una dependencia nativa en ejecución.[1]

## Uso

La consulta pública permanece en `/`. El laboratorio se abre en `/laboratorio`: lee un XML sólo en el navegador, aplica las reglas educativas y, para `Comprobante`, ejecuta el perfil XSD CFDI 4.0 local. La ruta `/laboratorio/cotizador` conserva la cotización aduanera sintética; sus importes son exclusivamente didácticos y no determinan contribuciones reales.

## Verificación reproducible

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build
```

La suite `client/src/lib/lab.test.ts` fija las identidades aritméticas, los códigos de regla y el cotizador sintético. `client/src/lib/lab.xsd.test.ts` compila el bundle XSD local, acepta el fixture CFDI 4.0 válido y rechaza el inválido. Los archivos de `lab/fixtures/` y `lab/schemas/` se compararon byte a byte con el laboratorio original antes de su retiro.

[1]: https://github.com/jameslan/libxml2-wasm "jameslan/libxml2-wasm"
