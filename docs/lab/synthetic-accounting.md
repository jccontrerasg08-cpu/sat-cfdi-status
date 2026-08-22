# Contabilidad sintética local

Esta guía presenta tres raíces XML **inventadas para el laboratorio**. Sirven para aprender a despachar XML por raíz, identificar valores decimales y comprobar identidades aritméticas pequeñas. No representan contabilidad electrónica, DIOT, pólizas, declaraciones, saldos, catálogos ni cumplimiento.

> Los nombres `catalog`, `balance` y `journal` son etiquetas pedagógicas. No implementan XSD, catálogos, certificados, sellos, RFC, IVA, periodos fiscales, archivos ZIP/XLSX/PDF ni servicios SAT/PAC.

## Modelo local

```text
FixtureLedgerCatalog
└── Account(id, name)

FixtureTrialBalance
└── Account(id, opening, debits, credits, closing)

FixtureJournal
└── Entry(id, date)
    └── Line(account, debit, credit)
```

La CLI reconoce las tres raíces contables sólo cuando coinciden el nombre local **y** el namespace exacto `https://example.invalid/fixture-ledger`. Este namespace no resuelve a un esquema ni a un servicio. Un elemento con el mismo nombre local en otro namespace produce `unexpected_root`; el escenario [`foreign-ledger-root.xml`](../fixtures/foreign-ledger-root.xml) protege esa frontera.

## Catálogo de cuentas ficticio

El catálogo demuestra que una cuenta necesita una identidad mínima y que esa identidad no se puede duplicar dentro del mismo fixture.

```xml
<lab:FixtureLedgerCatalog xmlns:lab="https://example.invalid/fixture-ledger">
  <lab:Account id="fixture-account-100" name="Caja de laboratorio" />
</lab:FixtureLedgerCatalog>
```

| Condición local | Código | Fixture |
|---|---|---|
| Falta `id` o `name`. | `ledger_account_missing_field` | [`ledger-catalog-missing-field.xml`](../fixtures/ledger-catalog-missing-field.xml) |
| Se repite un `id`. | `ledger_account_duplicate` | [`ledger-catalog-duplicate.xml`](../fixtures/ledger-catalog-duplicate.xml) |
| Dos cuentas son legibles y distintas. | Sin `issues`. | [`ledger-catalog-valid.xml`](../fixtures/ledger-catalog-valid.xml) |

No se comprueba la estructura jerárquica, naturaleza de cuenta, catálogos oficiales o periodos.

## Balanza de prueba ficticia

La única identidad es:

> `closing = opening + debits - credits`

```xml
<lab:FixtureTrialBalance xmlns:lab="https://example.invalid/fixture-ledger">
  <lab:Account id="fixture-account-100"
               opening="100.00"
               debits="50.00"
               credits="25.00"
               closing="125.00" />
</lab:FixtureTrialBalance>
```

Los cuatro valores deben ser `Decimal` finitos. La implementación no usa `float`, por lo que la lección no depende de imprecisión binaria.

| Condición local | Código | Fixture |
|---|---|---|
| Un importe no es decimal finito. | `ledger_amount_invalid` | [`trial-balance-invalid-amount.xml`](../fixtures/trial-balance-invalid-amount.xml) |
| La identidad aritmética no coincide. | `ledger_balance_inconsistent` | [`trial-balance-inconsistent.xml`](../fixtures/trial-balance-inconsistent.xml) |
| Todas las cuentas satisfacen la identidad. | Sin `issues`. | [`trial-balance-valid.xml`](../fixtures/trial-balance-valid.xml) |

Los términos `debits` y `credits` describen sólo variables de ejemplo; el laboratorio no calcula impuestos, saldos fiscales ni balances oficiales.

## Diario ficticio

Un `Entry` debe contener al menos una `Line`; cada línea necesita `debit` y `credit` decimales finitos. Cuando todas son legibles, se revisa:

> `sum(debit) = sum(credit)`

```xml
<lab:FixtureJournal xmlns:lab="https://example.invalid/fixture-ledger">
  <lab:Entry id="fixture-entry-001" date="2024-01-15">
    <lab:Line account="fixture-account-100" debit="100.00" credit="0.00" />
    <lab:Line account="fixture-account-200" debit="0.00" credit="100.00" />
  </lab:Entry>
</lab:FixtureJournal>
```

| Condición local | Código | Fixture |
|---|---|---|
| No existen líneas. | `journal_entry_missing_line` | [`journal-empty-entry.xml`](../fixtures/journal-empty-entry.xml) |
| Un importe de línea no es decimal finito. | `journal_amount_invalid` | [`journal-invalid-amount.xml`](../fixtures/journal-invalid-amount.xml) |
| Cargos y abonos no suman lo mismo. | `journal_entry_unbalanced` | [`journal-unbalanced.xml`](../fixtures/journal-unbalanced.xml) |
| Las líneas son legibles y están equilibradas. | Sin `issues`. | [`journal-valid.xml`](../fixtures/journal-valid.xml) |

Los campos `id`, `date` y `account` son etiquetas visibles para estudiantes. No se valida su formato, no se enlazan con documentos CFDI y no se escribe ni modifica XML.

## Ejecución

```bash
python3 src/cfdi_fixture_lab.py \
  fixtures/ledger-catalog-valid.xml \
  fixtures/trial-balance-inconsistent.xml \
  fixtures/journal-unbalanced.xml \
  --summary
```

La salida conserva una línea JSON Lines por fixture y agrega el resumen local al final. Consulta el [contrato de salida](output.md) para su forma exacta.

## Decisión de alcance

CFDI Fixture Lab implementa únicamente tres lecciones estructurales: identidad de cuenta, igualdad de saldo y equilibrio de líneas. El módulo no pretende representar contabilidad electrónica ni un flujo de envío.

| Se conserva como lección local | Se excluye explícitamente |
|---|---|
| Registros anidados pequeños. | XML/XSD de contabilidad electrónica, serialización externa y catálogos SAT. |
| `Decimal` y ecuaciones transparentes. | IVA, saldos fiscales, DIOT, RFC, CURP y declaraciones. |
| Despacho por raíz XML ficticia. | Firmas, certificados, sellos, ZIP/PDF/XLSX y archivos de envío. |
| Validación sin red. | SAT/PAC, Banxico, portal, credenciales, sesiones y consultas remotas. |

La [matriz de adopción](../DETAILED_ADOPTION_MATRIX.md) conserva las decisiones de alcance y dependencia que sustentan esta lección.

[Inicio](../README.md) · [Centro de documentación](README.md) · [Reglas](rules.md) · [Fixtures](fixtures.md) · [Salida](output.md)
