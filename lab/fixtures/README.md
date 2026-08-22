# Fixtures sintéticos

Este directorio contiene los XML usados por las pruebas y los ejemplos de CLI. Cada archivo es completamente ficticio, se procesa sólo de forma local y representa una sola lección educativa.

> No uses este directorio para comprobantes, RFC, sellos, certificados, UUID de terceros, datos de operaciones reales ni archivos para envío. Los fixtures de contabilidad usan `https://example.invalid/fixture-ledger`; los de envío usan `https://example.invalid/fixture-trade`.

| Fixture | Pregunta de aprendizaje | Resultado esperado |
|---|---|---|
| `minimal.xml` | ¿Cuál es el caso base CFDI entendido por el laboratorio? | Sin `issues`. |
| `uuid-missing.xml` | ¿Cómo se explica un timbre sintético sin UUID? | `uuid_missing`. |
| `multiple-timbres-one-uuid-missing.xml` | ¿Cada TFD sintético reconocido requiere su propio UUID? | `uuid_missing` para el timbre vacío. |
| `fecha-inconsistent.xml` | ¿Cómo se detecta la ventana educativa para `Version="4.0"`? | `fecha_inconsistent`. |
| `required-field-missing.xml` | ¿Cómo se señala un atributo mínimo ausente? | `required_attribute_missing` para `Moneda`. |
| `required-field-empty.xml` | ¿Un atributo mínimo vacío cuenta como ausente? | `required_attribute_missing` para `Moneda`. |
| `unsupported-complement.xml` | ¿Cómo se declara un complemento fuera del alcance? | `unsupported_complement`. |
| `foreign-timbre.xml` | ¿Cómo se rechaza un TFD de otro namespace? | `unsupported_complement`, nunca `uuid_missing`. |
| `fecha-invalid.xml` | ¿Cómo se expresa una fecha ilegible? | `fecha_invalid`. |
| `unexpected-root.xml` | ¿Qué ocurre con una raíz didáctica no admitida? | `unexpected_root`. |
| `malformed.xml` | ¿Qué ocurre si XML no se puede parsear? | `xml_parse_error`. |
| `foreign-ledger-root.xml` | ¿Cómo se rechaza una raíz contable de otro namespace? | `unexpected_root`. |
| `ledger-catalog-valid.xml` | ¿Cómo se ve un catálogo didáctico mínimo? | Sin `issues`. |
| `ledger-catalog-missing-field.xml` | ¿Cómo se explica una cuenta sin identidad completa? | `ledger_account_missing_field`. |
| `ledger-catalog-duplicate.xml` | ¿Cómo se detecta una cuenta repetida? | `ledger_account_duplicate`. |
| `trial-balance-valid.xml` | ¿Cómo se ve una identidad de saldo correcta? | Sin `issues`. |
| `trial-balance-invalid-amount.xml` | ¿Cómo se explica un importe no decimal? | `ledger_amount_invalid`. |
| `trial-balance-inconsistent.xml` | ¿Cómo se detecta un cierre inconsistente? | `ledger_balance_inconsistent`. |
| `journal-valid.xml` | ¿Cómo se ve un asiento ficticio equilibrado? | Sin `issues`. |
| `journal-empty-entry.xml` | ¿Qué ocurre si un asiento no tiene líneas? | `journal_entry_missing_line`. |
| `journal-invalid-amount.xml` | ¿Cómo se explica un importe de línea ilegible? | `journal_amount_invalid`. |
| `journal-unbalanced.xml` | ¿Cómo se demuestra un asiento no equilibrado? | `journal_entry_unbalanced`. |
| `journal-multiple-entries-one-unbalanced.xml` | ¿Cómo se ubica el único asiento no equilibrado? | `journal_entry_unbalanced` en `Entry 2`. |
| `foreign-trade-root.xml` | ¿Cómo se rechaza un envío de otro namespace? | `unexpected_root`. |
| `trade-shipment-valid.xml` | ¿Cómo se ve un envío ficticio con total transparente? | Sin `issues`. |
| `trade-shipment-zero-unit-value.xml` | ¿Un valor unitario de cero es válido con cantidad positiva? | Sin `issues`. |
| `trade-shipment-line-missing-field.xml` | ¿Cómo se explica una línea de envío incompleta? | `trade_line_missing_field`. |
| `trade-shipment-invalid-amount.xml` | ¿Cómo se explica una cantidad no positiva? | `trade_line_amount_invalid`. |
| `trade-shipment-invalid-total.xml` | ¿Cómo se explica un total declarado inválido? | `trade_declared_total_invalid`. |
| `trade-shipment-total-inconsistent.xml` | ¿Cómo se detecta una suma de líneas inconsistente? | `trade_declared_total_inconsistent`. |
| `trade-shipment-empty.xml` | ¿Qué ocurre si un envío no tiene líneas? | `trade_shipment_missing_line`. |

La guía detallada —con ejemplos de salida, propósito y pasos para añadir escenarios— vive en [`docs/fixtures.md`](../docs/fixtures.md). Las definiciones de las reglas están en [`docs/rules.md`](../docs/rules.md); las fronteras de los tres dominios locales aparecen en [`docs/synthetic-accounting.md`](../docs/synthetic-accounting.md) y [`docs/synthetic-foreign-trade.md`](../docs/synthetic-foreign-trade.md).

[Inicio](../README.md) · [Centro de documentación](../docs/README.md) · [Contabilidad sintética](../docs/synthetic-accounting.md) · [Comercio exterior sintético](../docs/synthetic-foreign-trade.md) · [Reglas](../docs/rules.md) · [Guía detallada](../docs/fixtures.md) · [Contribuir](../CONTRIBUTING.md)
