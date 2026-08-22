# Catálogo de reglas educativas

Las reglas de CFDI Fixture Lab viven en [`src/cfdi_fixture_lab.py`](../src/cfdi_fixture_lab.py). Son pequeñas, deterministas y deliberadamente incompletas: convierten una condición observable de un XML ficticio en un mensaje útil.

> [!IMPORTANT]
> Este catálogo documenta el comportamiento del repositorio, no requisitos fiscales oficiales, contables, de timbrado o de envío. Cada regla se lee junto con su fixture y prueba asociados.

## Raíces sintéticas admitidas

| Raíz local | Lección | No representa |
|---|---|---|
| `Comprobante` | Campos, fecha y complementos de un CFDI ficticio. | Un CFDI válido o timbrable. |
| `FixtureLedgerCatalog` | Identidad mínima de cuentas didácticas. | Un catálogo de cuentas oficial. |
| `FixtureTrialBalance` | La igualdad `cierre = apertura + cargos - abonos`. | Una balanza de comprobación oficial. |
| `FixtureJournal` | El equilibrio aritmético de un asiento sintético. | Una póliza o registro contable presentable. |
| `FixtureTradeShipment` | Campos de envío ficticios y total de líneas transparente. | Clasificación, arancel, tratado, pedimento o despacho. |

Los documentos contables usan `https://example.invalid/fixture-ledger` y el envío ficticio usa `https://example.invalid/fixture-trade`; todos contienen valores claramente ficticios y se leen localmente. Los nombres contables se inspiran sólo en estructuras observadas estáticamente en `python-satcfdi`; el envío didáctico toma la secuencia de campos y total como patrón de experiencia de una referencia pública, sin importar código, datos ni cálculos [1] [2].

## Convenciones

| Campo | Significado |
|---|---|
| `code` | Identificador estable y breve usado por pruebas y consumidores. |
| `rule` | Nombre legible de la regla educativa. |
| `message` | Explicación humana en español. |
| `fragment` | Nodo o atributo representativo para orientar la inspección. |
| Fixture | Archivo XML ficticio que demuestra la condición. |

## Reglas de estructura y lectura

| Código | Regla | Disparador | Fixture o prueba |
|---|---|---|---|
| `xml_parse_error` | `well_formed_xml` | No se puede abrir una ruta local o `ElementTree` no puede parsear XML. | [`fixtures/malformed.xml`](../fixtures/malformed.xml). |
| `unexpected_root` | `root_is_comprobante` | La raíz no está dentro de las cinco raíces didácticas admitidas. El nombre de regla se conserva por compatibilidad con la primera versión del laboratorio. | [`fixtures/unexpected-root.xml`](../fixtures/unexpected-root.xml), [`fixtures/foreign-ledger-root.xml`](../fixtures/foreign-ledger-root.xml) y [`fixtures/foreign-trade-root.xml`](../fixtures/foreign-trade-root.xml). |

Estas condiciones se resuelven antes de toda regla dependiente. Un XML ilegible no llega a atributos, fechas, complementos ni aritmética.

## Reglas de `Comprobante` sintético

| Código | Regla | Disparador | Escenario incluido |
|---|---|---|---|
| `required_attribute_missing` | `comprobante_required_attributes` | Falta o está vacío uno de los diez atributos mínimos internos. | [`fixtures/required-field-missing.xml`](../fixtures/required-field-missing.xml) y [`fixtures/required-field-empty.xml`](../fixtures/required-field-empty.xml). |
| `fecha_invalid` | `fecha_iso8601` | `Version="4.0"` tiene una `Fecha` que `datetime.fromisoformat` no interpreta. | [`fixtures/fecha-invalid.xml`](../fixtures/fecha-invalid.xml). |
| `fecha_inconsistent` | `version_4_date_window` | `Version="4.0"` tiene una fecha legible anterior a `2022-01-01`. | [`fixtures/fecha-inconsistent.xml`](../fixtures/fecha-inconsistent.xml). |
| `uuid_missing` | `timbre_uuid_present` | Cada TFD sintético de namespace exacto debe tener su propio `UUID` no vacío. | [`fixtures/uuid-missing.xml`](../fixtures/uuid-missing.xml) y [`fixtures/multiple-timbres-one-uuid-missing.xml`](../fixtures/multiple-timbres-one-uuid-missing.xml). |
| `unsupported_complement` | `supported_complements` | Un hijo de `Complemento` no es el TFD exacto admitido. | [`fixtures/unsupported-complement.xml`](../fixtures/unsupported-complement.xml) y [`fixtures/foreign-timbre.xml`](../fixtures/foreign-timbre.xml). |

La lista de atributos es interna: `Version`, `Fecha`, `SubTotal`, `Total`, `Moneda`, `TipoDeComprobante`, `Exportacion`, `MetodoPago`, `FormaPago` y `LugarExpedicion`. No evalúa catálogos, tipos fiscales, combinaciones permitidas, firmas ni servicios remotos.

## Reglas de contabilidad sintética

| Código | Regla | Disparador | Escenario incluido |
|---|---|---|---|
| `ledger_account_missing_field` | `ledger_account_identity` | Una cuenta de `FixtureLedgerCatalog` no tiene `id` o `name`. | [`fixtures/ledger-catalog-missing-field.xml`](../fixtures/ledger-catalog-missing-field.xml). |
| `ledger_account_duplicate` | `ledger_account_identity` | Dos cuentas de `FixtureLedgerCatalog` comparten el mismo `id`. | [`fixtures/ledger-catalog-duplicate.xml`](../fixtures/ledger-catalog-duplicate.xml). |
| `ledger_amount_invalid` | `ledger_decimal_amounts` | Un importe `opening`, `debits`, `credits` o `closing` no es decimal finito. | [`fixtures/trial-balance-invalid-amount.xml`](../fixtures/trial-balance-invalid-amount.xml). |
| `ledger_balance_inconsistent` | `ledger_balance_identity` | `closing` no coincide con `opening + debits - credits`. | [`fixtures/trial-balance-inconsistent.xml`](../fixtures/trial-balance-inconsistent.xml). |
| `journal_entry_missing_line` | `journal_entry_lines` | Un `Entry` no contiene ninguna línea. | [`fixtures/journal-empty-entry.xml`](../fixtures/journal-empty-entry.xml). |
| `journal_amount_invalid` | `journal_decimal_amounts` | Un `Line` no contiene `debit` o `credit` decimal finito. | [`fixtures/journal-invalid-amount.xml`](../fixtures/journal-invalid-amount.xml). |
| `journal_entry_unbalanced` | `journal_entry_balance` | La suma de cargos no coincide con la suma de abonos de un `Entry`. | [`fixtures/journal-unbalanced.xml`](../fixtures/journal-unbalanced.xml). |

La aritmética usa `Decimal` de la biblioteca estándar y sólo revisa identidades transparentes de fixtures. No evalúa IVA, saldos fiscales, RFC, certificados, pólizas oficiales, catálogos SAT, DIOT, declaraciones ni cumplimiento contable.

## Reglas de comercio exterior sintético

| Código | Regla | Disparador | Escenario incluido |
|---|---|---|---|
| `trade_shipment_missing_line` | `trade_shipment_lines` | `FixtureTradeShipment` no contiene `Line` del namespace exacto. | [`fixtures/trade-shipment-empty.xml`](../fixtures/trade-shipment-empty.xml). |
| `trade_line_missing_field` | `trade_line_identity` | Falta `product_id`, `origin` o `destination` en una línea ficticia. | [`fixtures/trade-shipment-line-missing-field.xml`](../fixtures/trade-shipment-line-missing-field.xml). |
| `trade_line_amount_invalid` | `trade_line_decimal_amounts` | `quantity` no es decimal finito mayor que cero, o `unit_value` no es decimal finito no negativo. | [`fixtures/trade-shipment-invalid-amount.xml`](../fixtures/trade-shipment-invalid-amount.xml). |
| `trade_declared_total_invalid` | `trade_declared_total_decimal` | `declared_total` no es decimal finito no negativo. | [`fixtures/trade-shipment-invalid-total.xml`](../fixtures/trade-shipment-invalid-total.xml). |
| `trade_declared_total_inconsistent` | `trade_declared_total_identity` | `declared_total` no coincide con `Σ(quantity × unit_value)`. | [`fixtures/trade-shipment-total-inconsistent.xml`](../fixtures/trade-shipment-total-inconsistent.xml). |

La suma es una lección de datos locales, no un cálculo aduanero. No evalúa clasificación LIGIE, NICO, país de origen real, tratados, aranceles, IGI, DTA, IVA, IEPS, CIF, RRNA, NOM, permisos, pedimentos, padrón o despacho. La [guía de comercio exterior sintético](synthetic-foreign-trade.md) documenta esta frontera.

## Orden de evaluación

```text
1. ¿Se puede leer XML?                              → xml_parse_error si no
2. ¿La raíz está admitida?                           → unexpected_root si no
3. Comprobante: atributos, fecha y complementos      → reglas CFDI locales
4. FixtureLedgerCatalog: identidad de Account        → reglas de catálogo sintético
5. FixtureTrialBalance: decimal e identidad saldo    → reglas de balanza sintética
6. FixtureJournal: líneas, decimales y equilibrio    → reglas de diario sintético
7. FixtureTradeShipment: campos y total local         → reglas de envío sintético
```

Una condición puede producir más de un `Issue`. El consumidor no debe asumir un máximo de un resultado ni interpretar su orden como prioridad fiscal o contable.

## Regla para añadir reglas

Una regla nueva necesita cuatro piezas antes de considerarse completa:

1. Un propósito educativo de una frase, delimitado y no certificador.
2. Un código estable, una regla legible, un mensaje y un fragmento comprobables localmente.
3. Un fixture XML totalmente ficticio que active la condición.
4. Una prueba enfocada que falle si la salida cambia de forma no intencional.

## Referencias

[1]: https://github.com/SAT-CFDI/python-satcfdi/tree/add4f218f070823a735fb66eab3f06091192773d "SAT-CFDI/python-satcfdi, revisión estática consultada"
[2]: https://sdv.com.mx/comercio-exterior/ "Comercio Exterior México 2026 — SDV"

[Inicio](../README.md) · [Centro de documentación](README.md) · [Contabilidad sintética](synthetic-accounting.md) · [Comercio exterior sintético](synthetic-foreign-trade.md) · [Fixtures](fixtures.md) · [Salida](output.md) · [Contribuir](../CONTRIBUTING.md)
