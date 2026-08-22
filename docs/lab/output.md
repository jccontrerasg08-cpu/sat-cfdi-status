# Contrato de salida JSON Lines

La CLI recibe una o más rutas XML locales y escribe **una línea JSON por ruta** en la salida estándar. Esta elección mantiene la salida legible en terminal y simple de consumir desde otro proceso sin introducir una dependencia. El laboratorio nunca transmite el XML: sólo lo lee desde el disco local durante esa ejecución.

## Ejecución

```bash
python3 src/cfdi_fixture_lab.py fixtures/minimal.xml fixtures/uuid-missing.xml
```

La salida contiene dos objetos JSON, uno por línea:

```json
{"file": "fixtures/minimal.xml", "issues": []}
{"file": "fixtures/uuid-missing.xml", "issues": [{"code": "uuid_missing", "rule": "timbre_uuid_present", "message": "El TimbreFiscalDigital sintético no contiene UUID.", "fragment": "<TimbreFiscalDigital UUID=...>"}]}
```

## Resumen agregado opcional

Para revisar un conjunto local sin perder las líneas por archivo, añade `--summary`:

```bash
python3 src/cfdi_fixture_lab.py --summary fixtures/*.xml
```

La CLI conserva una línea por ruta y agrega una línea final con este objeto:

```json
{"summary": {"files": 31, "issues": 25, "codes": {"fecha_inconsistent": 1, "fecha_invalid": 1, "journal_amount_invalid": 1, "journal_entry_missing_line": 1, "journal_entry_unbalanced": 2, "ledger_account_duplicate": 1, "ledger_account_missing_field": 1, "ledger_amount_invalid": 1, "ledger_balance_inconsistent": 1, "required_attribute_missing": 2, "trade_declared_total_inconsistent": 1, "trade_declared_total_invalid": 1, "trade_line_amount_invalid": 1, "trade_line_missing_field": 1, "trade_shipment_missing_line": 1, "unexpected_root": 3, "unsupported_complement": 2, "uuid_missing": 2, "xml_parse_error": 1}}}
```

| Campo de resumen | Significado |
|---|---|
| `summary.files` | Número de rutas procesadas en esa ejecución local. |
| `summary.issues` | Suma de las condiciones educativas **emitidas**. Cuando se usa `--filter`, sólo cuenta las condiciones que sobrevivieron al filtro. |
| `summary.codes` | Recuento por código, ordenado alfabéticamente para que sea reproducible. |

El resumen no clasifica validez fiscal y no incluye contenido XML, nombres, RFC, certificados ni información de los archivos. Es una ayuda de demostración y comparación local.

## Filtrar códigos de issue

`--filter CODE` conserva sólo los `issues` cuyo `code` coincide con el código indicado. Puede repetirse para incluir más de un código. La CLI sigue escribiendo **una línea JSON por ruta**: una ruta sin coincidencias conserva `"issues": []`.

```bash
python3 src/cfdi_fixture_lab.py --filter uuid_missing fixtures/*.xml
python3 src/cfdi_fixture_lab.py --filter uuid_missing --filter unsupported_complement --summary fixtures/*.xml
```

El filtro no modifica los cuatro campos de cada issue ni oculta rutas procesadas. Tampoco añade reglas ni interpreta códigos desconocidos: un código que no coincide simplemente deja listas vacías. Para que un resumen siga siendo coherente con lo que se imprimió, `--summary` cuenta únicamente los issues filtrados.

## Raíces admitidas en texto

`--roots` imprime una lista humana y determinista de las cinco raíces admitidas, sus namespaces y la lección local asociada. No abre XML ni produce JSON Lines; es una vista breve para orientación antes de ejecutar una demostración.

```bash
python3 src/cfdi_fixture_lab.py --roots
```

```text
Raíces XML compatibles (laboratorio local y sintético):
- Comprobante — cualquier espacio de nombres — CFDI structural checks
- FixtureLedgerCatalog — https://example.invalid/fixture-ledger — synthetic account identity
- FixtureTrialBalance — https://example.invalid/fixture-ledger — synthetic Decimal balance identity
- FixtureJournal — https://example.invalid/fixture-ledger — synthetic debit-credit balance
- FixtureTradeShipment — https://example.invalid/fixture-trade — synthetic shipment total identity
```

`Comprobante` se reconoce por nombre local para conservar el contrato didáctico existente. Las cuatro raíces sintéticas restantes requieren el namespace exacto mostrado. Ninguna de estas líneas afirma compatibilidad fiscal, contable o aduanera fuera de los fixtures ficticios del repositorio.

## Demostración autocontenida

`--demo` no recibe rutas adicionales. Descubre únicamente los XML versionados en el directorio `fixtures/` del proyecto y activa el mismo resumen final:

```bash
python3 src/cfdi_fixture_lab.py --demo
```

Esta opción existe para una demostración reproducible en entrevista; no descarga ni acepta un corpus externo. El [guion de demostración](interview-demo.md) explica el recorrido técnico.

## Catálogo local de capacidades

`--catalog` imprime un solo objeto JSON que describe la superficie local de la versión instalada, sin abrir XML ni ejecutar reglas:

```bash
python3 src/cfdi_fixture_lab.py --catalog
```

El objeto contiene `scope`, `transport`, `output`, `roots` y `rule_codes`. Las raíces sintéticas declaran su namespace exacto; `Comprobante` conserva la política de nombre local usada por el laboratorio. Este catálogo no es un catálogo SAT, una especificación fiscal ni una promesa de compatibilidad con XML externo. Se usa sólo para descubrir el contrato didáctico de esta CLI.

El campo `schema_profiles` describe perfiles estructurales instalados por separado. El primer perfil es `cfdi_4_0_xsd`; su contrato y límites están en [`cfdi40-structural-validation.md`](cfdi40-structural-validation.md).

## Perfil estructural CFDI 4.0

```bash
python3 src/cfdi_fixture_lab.py --xsd-cfdi40 fixtures/xsd/cfdi40-xsd-valid.xml
```

La salida mantiene una línea JSON por ruta, pero usa la clave `schema` en vez de `issues`. No puede combinarse con `--demo` ni `--summary`, porque representa un perfil estructural independiente de las reglas didácticas.

## Forma del objeto

```json
{
  "file": "ruta/que/recibió/la/CLI.xml",
  "issues": [
    {
      "code": "identificador_estable",
      "rule": "nombre_de_regla_educativa",
      "message": "Explicación legible para una persona.",
      "fragment": "Pista XML pequeña y relevante."
    }
  ]
}
```

| Campo | Tipo | Garantía actual | Uso recomendado |
|---|---|---|---|
| `file` | cadena | Es la representación de la ruta proporcionada a la CLI. | Mostrar el origen del resultado. Evita publicar salidas si la ruta contiene datos sensibles. |
| `issues` | lista | Siempre existe; puede estar vacía. | Iterar cada condición detectada. |
| `issues[].code` | cadena | Identificador estable de una condición educativa. | Usar en pruebas, filtros y automatización local. |
| `issues[].rule` | cadena | Nombre legible y estable de la regla interna. | Enlazar con [`rules.md`](rules.md). |
| `issues[].message` | cadena | Explicación en español para lectura humana. | Mostrar al usuario; no depender del texto exacto. |
| `issues[].fragment` | cadena | Pista corta de elemento o atributo relacionado. | Orientar la inspección del fixture. |

## Semántica de `issues`

Una lista vacía sólo tiene el siguiente significado:

> Ninguna de las reglas educativas implementadas por esta versión se activó para ese fixture.

Con `--filter`, también puede significar que una regla sí se activó pero ninguno de sus códigos coincide con el filtro solicitado. No significa que el XML sea válido para emisión, timbrado, recepción, contabilidad, auditoría o cualquier otro uso fiscal. El repositorio no implementa un esquema oficial completo, catálogos, certificados, firmas, reglas condicionales ni servicios remotos.

Una lista puede contener varios objetos. Los consumidores no deben asumir un máximo de un problema ni utilizar la posición como una prioridad fiscal.

## Códigos conocidos

| Código | Lectura resumida |
|---|---|
| `xml_parse_error` | No fue posible leer el XML local. |
| `unexpected_root` | La raíz no es una forma didáctica admitida por el laboratorio. |
| `required_attribute_missing` | Falta o está vacío un atributo mínimo interno. |
| `fecha_invalid` | La fecha no se puede leer como ISO 8601 por el laboratorio. |
| `fecha_inconsistent` | La combinación ejemplo de versión y fecha activa la ventana educativa. |
| `uuid_missing` | Falta UUID en un timbre sintético reconocido. |
| `unsupported_complement` | Aparece un complemento fuera del alcance actual. |
| `ledger_account_missing_field` | Una cuenta sintética no tiene `id` o `name`. |
| `ledger_account_duplicate` | Una cuenta sintética repite un identificador. |
| `ledger_amount_invalid` | Un importe de balanza no es decimal finito. |
| `ledger_balance_inconsistent` | Un saldo no cumple `apertura + cargos - abonos`. |
| `journal_entry_missing_line` | Un asiento sintético no contiene líneas. |
| `journal_amount_invalid` | Un importe de línea no es decimal finito. |
| `journal_entry_unbalanced` | Los cargos y abonos de un asiento no coinciden. |
| `trade_shipment_missing_line` | Un envío sintético no contiene líneas. |
| `trade_line_missing_field` | Una línea de envío no contiene un campo de identidad. |
| `trade_line_amount_invalid` | `quantity` o `unit_value` no cumple el importe local permitido. |
| `trade_declared_total_invalid` | `declared_total` no es decimal finito no negativo. |
| `trade_declared_total_inconsistent` | El total declarado no coincide con la suma local de líneas. |

La definición completa de cada código aparece en [`rules.md`](rules.md).

## Errores de argumentos y modos exclusivos

La validación satisfactoria escribe JSON Lines en stdout. Los errores de uso de argumentos los emite `argparse` en stderr y terminan con un estado distinto de cero. Los modos de descubrimiento se usan solos:

| Opción | Puede combinarse con | No puede combinarse con |
|---|---|---|
| Rutas XML | `--summary` y uno o más `--filter CODE`. | `--demo`, `--catalog`, `--roots`. |
| `--demo` | `--summary` y uno o más `--filter CODE`; ya añade resumen. | Rutas XML, `--catalog`, `--roots`. |
| `--catalog` | Ninguna otra opción. | Rutas XML, `--demo`, `--summary`, `--filter`, `--roots`. |
| `--roots` | Ninguna otra opción. | Rutas XML, `--demo`, `--summary`, `--filter`, `--catalog`. |

## Consumo desde shell

Para ver sólo las líneas que contienen problemas, usa una herramienta local que entienda JSON. Por ejemplo, si `jq` está disponible en tu entorno:

```bash
python3 src/cfdi_fixture_lab.py fixtures/*.xml | jq 'select(.issues | length > 0)'
```

`jq` no forma parte del proyecto ni es necesario para ejecutar el laboratorio. La única interfaz soportada por el repositorio es la salida JSON Lines de la CLI.

## Compatibilidad y cambios

| Cambio | Tratamiento esperado |
|---|---|
| Mejorar `message` | Permitido si `code`, `rule` y la prueba siguen describiendo la misma condición. |
| Añadir un código nuevo | Requiere fixture, prueba y entrada en [`rules.md`](rules.md). |
| Eliminar o renombrar un código | Es un cambio de contrato; documenta el motivo y actualiza pruebas/guías en el mismo cambio. |
| Añadir campos | Mantén los cuatro campos existentes de `Issue` y documenta el nuevo campo. |
| Añadir `--summary` | Debe conservar una línea por archivo y añadir solamente un objeto final `summary`. |
| Añadir `--filter` | Debe conservar una línea por archivo, conservar listas vacías y calcular el resumen sobre los issues emitidos. |
| Añadir `--demo` | Debe limitarse a fixtures versionados, no aceptar rutas adicionales y conservar el resumen final. |
| Añadir `--catalog` | Debe emitir un único objeto sin abrir XML y rechazar rutas, `--demo`, `--summary`, `--filter` o `--roots` combinados. |
| Añadir `--roots` | Debe imprimir las raíces en orden de catálogo sin abrir XML y rechazar rutas, `--demo`, `--summary`, `--filter` o `--catalog` combinados. |
| Cambiar la salida a otro formato | No hacerlo sin una necesidad concreta y una ruta de migración. |

[Inicio](../README.md) · [Centro de documentación](README.md) · [Guion de entrevista](interview-demo.md) · [Contabilidad sintética](synthetic-accounting.md) · [Comercio exterior sintético](synthetic-foreign-trade.md) · [Arquitectura](architecture.md) · [Reglas](rules.md) · [Fixtures](fixtures.md) · [Contribuir](../CONTRIBUTING.md)
