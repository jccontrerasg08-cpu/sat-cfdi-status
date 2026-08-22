# Guía de fixtures sintéticos

Cada archivo en [`fixtures/`](../fixtures/) es una pieza de material didáctico. Los nombres describen la condición que el archivo quiere enseñar, no el estado de un documento real. Ningún XML del repositorio representa una operación, contribuyente, sello, certificado ni identificador utilizable.

## Mapa de escenarios

| Fixture | Pregunta de aprendizaje | Regla activada | Resultado esperado |
|---|---|---|---|
| [`minimal.xml`](../fixtures/minimal.xml) | ¿Cómo se ve el caso base entendido por el laboratorio? | Ninguna. | `issues: []`. |
| [`uuid-missing.xml`](../fixtures/uuid-missing.xml) | ¿Cómo se explica un timbre sintético sin UUID? | `timbre_uuid_present`. | `uuid_missing`. |
| [`multiple-timbres-one-uuid-missing.xml`](../fixtures/multiple-timbres-one-uuid-missing.xml) | ¿Cada TFD sintético reconocido necesita su propio UUID? | `timbre_uuid_present`. | `uuid_missing` para el timbre que está vacío. |
| [`fecha-inconsistent.xml`](../fixtures/fecha-inconsistent.xml) | ¿Cómo se conecta una versión con una ventana de fecha educativa? | `version_4_date_window`. | `fecha_inconsistent`. |
| [`required-field-missing.xml`](../fixtures/required-field-missing.xml) | ¿Cómo se señala un atributo mínimo ausente? | `comprobante_required_attributes`. | `required_attribute_missing`. |
| [`required-field-empty.xml`](../fixtures/required-field-empty.xml) | ¿Un atributo mínimo vacío se trata como ausente? | `comprobante_required_attributes`. | `required_attribute_missing`. |
| [`unsupported-complement.xml`](../fixtures/unsupported-complement.xml) | ¿Cómo se declara un complemento fuera del alcance actual? | `supported_complements`. | `unsupported_complement`. |
| [`foreign-timbre.xml`](../fixtures/foreign-timbre.xml) | ¿Por qué el espacio de nombres forma parte de la identidad de un complemento? | `supported_complements`. | `unsupported_complement`, nunca `uuid_missing`. |
| [`fecha-invalid.xml`](../fixtures/fecha-invalid.xml) | ¿Cómo se explica una fecha que el laboratorio no puede interpretar? | `fecha_iso8601`. | `fecha_invalid`. |
| [`unexpected-root.xml`](../fixtures/unexpected-root.xml) | ¿Qué ocurre cuando la raíz no es una forma didáctica admitida? | `root_is_comprobante`. | `unexpected_root`. |
| [`malformed.xml`](../fixtures/malformed.xml) | ¿Qué ocurre si no existe un árbol XML legible? | `well_formed_xml`. | `xml_parse_error`. |
| [`foreign-ledger-root.xml`](../fixtures/foreign-ledger-root.xml) | ¿Por qué la raíz contable requiere namespace exacto? | `root_is_comprobante`. | `unexpected_root`. |
| [`foreign-trade-root.xml`](../fixtures/foreign-trade-root.xml) | ¿Por qué la raíz de envío requiere namespace exacto? | `root_is_comprobante`. | `unexpected_root`. |
| [`trade-shipment-valid.xml`](../fixtures/trade-shipment-valid.xml) | ¿Cómo se ve un envío ficticio con total transparente? | Ninguna. | `issues: []`. |
| [`trade-shipment-zero-unit-value.xml`](../fixtures/trade-shipment-zero-unit-value.xml) | ¿Un valor unitario de cero sigue siendo un importe local válido? | Ninguna. | `issues: []`. |
| [`trade-shipment-line-missing-field.xml`](../fixtures/trade-shipment-line-missing-field.xml) | ¿Cómo se explica una identidad de línea incompleta? | `trade_line_identity`. | `trade_line_missing_field`. |
| [`trade-shipment-invalid-amount.xml`](../fixtures/trade-shipment-invalid-amount.xml) | ¿Cómo se explica una cantidad local no positiva? | `trade_line_decimal_amounts`. | `trade_line_amount_invalid`. |
| [`trade-shipment-invalid-total.xml`](../fixtures/trade-shipment-invalid-total.xml) | ¿Cómo se explica un total declarado negativo? | `trade_declared_total_decimal`. | `trade_declared_total_invalid`. |
| [`trade-shipment-total-inconsistent.xml`](../fixtures/trade-shipment-total-inconsistent.xml) | ¿Cómo se detecta una suma de líneas inconsistente? | `trade_declared_total_identity`. | `trade_declared_total_inconsistent`. |
| [`trade-shipment-empty.xml`](../fixtures/trade-shipment-empty.xml) | ¿Qué ocurre si un envío no tiene líneas? | `trade_shipment_lines`. | `trade_shipment_missing_line`. |
| [`ledger-catalog-valid.xml`](../fixtures/ledger-catalog-valid.xml) | ¿Cómo se ve un catálogo de cuentas didáctico mínimo? | Ninguna. | `issues: []`. |
| [`ledger-catalog-missing-field.xml`](../fixtures/ledger-catalog-missing-field.xml) | ¿Cómo se explica una cuenta sin identidad completa? | `ledger_account_identity`. | `ledger_account_missing_field`. |
| [`ledger-catalog-duplicate.xml`](../fixtures/ledger-catalog-duplicate.xml) | ¿Cómo se detecta una cuenta sintética repetida? | `ledger_account_identity`. | `ledger_account_duplicate`. |
| [`trial-balance-valid.xml`](../fixtures/trial-balance-valid.xml) | ¿Cómo se expresa una identidad de saldo transparente? | Ninguna. | `issues: []`. |
| [`trial-balance-invalid-amount.xml`](../fixtures/trial-balance-invalid-amount.xml) | ¿Cómo se separa un importe ilegible de una ecuación? | `ledger_decimal_amounts`. | `ledger_amount_invalid`. |
| [`trial-balance-inconsistent.xml`](../fixtures/trial-balance-inconsistent.xml) | ¿Cómo se detecta un cierre aritméticamente inconsistente? | `ledger_balance_identity`. | `ledger_balance_inconsistent`. |
| [`journal-valid.xml`](../fixtures/journal-valid.xml) | ¿Cómo se ve un asiento sintético equilibrado? | Ninguna. | `issues: []`. |
| [`journal-empty-entry.xml`](../fixtures/journal-empty-entry.xml) | ¿Qué ocurre si un asiento no tiene líneas? | `journal_entry_lines`. | `journal_entry_missing_line`. |
| [`journal-invalid-amount.xml`](../fixtures/journal-invalid-amount.xml) | ¿Cómo se explica un importe de línea ilegible? | `journal_decimal_amounts`. | `journal_amount_invalid`. |
| [`journal-unbalanced.xml`](../fixtures/journal-unbalanced.xml) | ¿Cómo se demuestra un asiento no equilibrado? | `journal_entry_balance`. | `journal_entry_unbalanced`. |
| [`journal-multiple-entries-one-unbalanced.xml`](../fixtures/journal-multiple-entries-one-unbalanced.xml) | ¿La explicación identifica el único asiento desequilibrado dentro de un diario con varias entradas? | `journal_entry_balance`. | `journal_entry_unbalanced` en `Entry 2`. |

## Caso base: `minimal.xml`

El caso base contiene el nodo `Comprobante` y todos los atributos mínimos internos. Su utilidad es demostrar que una lista vacía de `issues` significa “ninguna regla implementada se activó”. No debe interpretarse como una certificación de validez ni como un ejemplo para emitir un comprobante.

```bash
python3 src/cfdi_fixture_lab.py fixtures/minimal.xml
```

```json
{"file": "fixtures/minimal.xml", "issues": []}
```

## Caso UUID ausente: `uuid-missing.xml`

El fixture contiene un `Complemento` con un hijo `TimbreFiscalDigital` sin atributo `UUID`. La regla produce un fragmento deliberadamente corto para que el lector sepa dónde mirar.

```json
{
  "code": "uuid_missing",
  "rule": "timbre_uuid_present",
  "fragment": "<TimbreFiscalDigital UUID=...>"
}
```

La lección no es “generar un UUID”; es cómo una condición de presencia se expresa como una advertencia estable y comprobable.

## Colisión de espacio de nombres: `foreign-timbre.xml`

Este fixture usa la etiqueta local `TimbreFiscalDigital`, pero dentro de un espacio de nombres de laboratorio diferente. El laboratorio sólo reconoce la etiqueta expandida exacta de TFD; por ello el resultado es `unsupported_complement` y no `uuid_missing`.

La lección es que el nombre local por sí solo no identifica de forma segura un complemento XML. La prueba asociada protege esta frontera para que una etiqueta de otro espacio de nombres no se interprete como un timbre admitido.

## Caso de fecha: `fecha-inconsistent.xml`

Este XML usa `Version="4.0"` y una fecha anterior a `2022-01-01`, que es el límite interno usado por la demostración. El resultado contiene ambos atributos porque el aprendizaje depende de su relación.

```json
{
  "code": "fecha_inconsistent",
  "rule": "version_4_date_window",
  "fragment": "Version=\"4.0\" Fecha=\"2021-12-31T23:59:59\""
}
```

La fecha elegida sólo crea un caso inequívoco para pruebas. No codifica una política fiscal ni reemplaza material oficial.

## Fecha ilegible: `fecha-invalid.xml`

`Fecha="no-es-una-fecha"` activa `fecha_invalid`. El fixture separa una fecha que no se puede leer de una fecha que se puede leer pero cae fuera de la ventana educativa. Este contraste evita que ambas condiciones se confundan en una demostración.

## Raíz inesperada y XML malformado

`unexpected-root.xml` contiene XML bien formado cuya raíz no está entre las cinco raíces didácticas admitidas, por lo que devuelve `unexpected_root` sin seguir a reglas dependientes. `malformed.xml` no llega a crear un árbol XML y devuelve solamente `xml_parse_error`. Juntos demuestran que el laboratorio distingue forma incorrecta de entrada imposible de parsear.

## Campo mínimo ausente: `required-field-missing.xml`

El escenario omite `Moneda`. La salida no intenta inventar un valor, completar la etiqueta ni modificar el archivo. Sólo construye un `Issue` por el atributo que falta. [`required-field-empty.xml`](../fixtures/required-field-empty.xml) muestra el mismo resultado cuando `Moneda=""`: para los diez atributos mínimos internos, vacío y ausente tienen la misma lección de presencia.

```json
{
  "code": "required_attribute_missing",
  "rule": "comprobante_required_attributes",
  "message": "Falta el atributo requerido de laboratorio: Moneda."
}
```

## Complemento no soportado: `unsupported-complement.xml`

El fixture incorpora un hijo llamado `ComplementoNoSoportado`. El laboratorio lo nombra explícitamente para demostrar que una herramienta pequeña puede declarar sus límites en vez de ignorar entradas que no reconoce.

```json
{
  "code": "unsupported_complement",
  "rule": "supported_complements",
  "message": "El complemento ComplementoNoSoportado está fuera del alcance del laboratorio."
}
```

## Contabilidad sintética

Los once fixtures de contabilidad y la frontera `foreign-ledger-root.xml` son material separado de los escenarios CFDI. Las tres raíces admitidas usan `https://example.invalid/fixture-ledger`, cuentas con prefijo `fixture-` y cantidades pequeñas; una raíz de otro namespace se rechaza. Ninguno contiene RFC, certificado, sello, UUID, impuesto, catálogo oficial, periodo declarable o salida para envío. [`journal-multiple-entries-one-unbalanced.xml`](../fixtures/journal-multiple-entries-one-unbalanced.xml) añade una entrada limpia y otra desequilibrada para verificar que el fragmento identifica `Entry 2`.

| Raíz | Fixtures limpios | Fronteras que enseñan |
|---|---|---|
| `FixtureLedgerCatalog` | `ledger-catalog-valid.xml` | Identidad presente y no repetida. |
| `FixtureTrialBalance` | `trial-balance-valid.xml` | Decimal finito e igualdad `cierre = apertura + cargos - abonos`. |
| `FixtureJournal` | `journal-valid.xml` | Líneas presentes, importes legibles y cargos iguales a abonos. |

La [guía de contabilidad sintética](synthetic-accounting.md) explica las tres formas y el [catálogo de reglas](rules.md#reglas-de-contabilidad-sintética) define cada resultado.

## Comercio exterior sintético

Los ocho fixtures de envío son material separado de CFDI y contabilidad. Usan `https://example.invalid/fixture-trade`, identificadores con prefijo `fixture-` y lugares de ejemplo `Origin-X` / `Destination-Y`. La única ecuación es `declared_total = Σ(quantity × unit_value)`. [`trade-shipment-zero-unit-value.xml`](../fixtures/trade-shipment-zero-unit-value.xml) complementa el caso de cantidad no positiva al demostrar que `quantity > 0` con `unit_value = 0` sigue siendo una línea local válida.

| Incluido | Deliberadamente fuera de alcance |
|---|---|
| Presencia de campos, `Decimal`, suma local y namespace exacto. | LIGIE/NICO, clasificación, aranceles, origen real, TLC, RRNA, permisos, pedimento, agente aduanal, despacho y servicios externos. |

La [guía de comercio exterior sintético](synthetic-foreign-trade.md) explica las formas, escenarios y frontera de seguridad.

## Añadir un fixture

Un fixture nuevo debe ser más pequeño que la explicación que enseña. Antes de crearlo, formula una sola pregunta de aprendizaje y comprueba que el escenario no se puede expresar con un archivo ya existente.

| Paso | Comprobación |
|---|---|
| Copia la forma mínima necesaria | No uses XML real ni datos de terceros. |
| Cambia sólo la condición educativa | Evita mezclar dos fallos no relacionados. |
| Escribe la expectativa | Define código, regla y fragmento antes de ejecutar. |
| Añade una prueba | Comprueba el contrato público, no detalles internos. |
| Actualiza esta guía | Une el nombre del archivo con su propósito. |

Consulta [`CONTRIBUTING.md`](../CONTRIBUTING.md#añadir-un-fixture) para el flujo completo y [`rules.md`](rules.md) para las definiciones de cada regla.

[Inicio](../README.md) · [Centro de documentación](README.md) · [Contabilidad sintética](synthetic-accounting.md) · [Comercio exterior sintético](synthetic-foreign-trade.md) · [Arquitectura](architecture.md) · [Reglas](rules.md) · [Salida](output.md) · [Contribuir](../CONTRIBUTING.md)
