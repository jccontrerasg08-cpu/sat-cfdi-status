# Guion de demostración para entrevista

CFDI Fixture Lab se presenta como una herramienta de ingeniería enfocada en **límites claros**: recibe XML sintético desde disco, despacha reglas pequeñas por tipo de documento, devuelve resultados explicables y demuestra que la seguridad de alcance es una decisión de arquitectura.

> La demostración no pretende simular timbrado, contabilidad electrónica ni una API fiscal. Enseña cómo diseñar un núcleo local, determinista, probado y preparado para crecer sin afirmar capacidades que no tiene.

![Flujo de demostración local](assets/interview-demo-flow.png)

## Demostración de 90 segundos

Desde la raíz del repositorio, ejecuta:

```bash
python3 src/cfdi_fixture_lab.py --demo
```

El comando descubre sólo los XML incluidos en `fixtures/`, escribe una línea JSON por archivo y termina con un resumen. En la versión actual procesa **31 fixtures** y produce **25 condiciones educativas**. No necesita red, credenciales, certificados, paquetes ni servicios externos.

Después muestra la verificación que protege el contrato:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -v
```

La suite prueba CFDI ficticio, parseo, namespaces, raíces de contabilidad sintética, `Decimal`, equilibrio de asientos y el contrato de `--demo`.

## Historia técnica

| Momento | Qué mostrar | Qué demuestra |
|---|---|---|
| Entrada | `fixtures/minimal.xml` y el comando de demo. | Sólo se aceptan archivos locales y ficticios. |
| Parseo | `validate_file` y `xml_parse_error`. | Un error de lectura corta el flujo antes de reglas derivadas. |
| Despacho | `validate`. | Una sola entrada controla cinco raíces explícitas. |
| CFDI | `Comprobante`, fecha y TFD por namespace exacto. | Separación entre identificadores XML locales y etiquetas expandidas. |
| Contabilidad didáctica | `FixtureLedgerCatalog`, `FixtureTrialBalance`, `FixtureJournal`. | Identidad, aritmética `Decimal` y equilibrio sin afirmar cumplimiento. |
| Comercio exterior didáctico | `FixtureTradeShipment`. | Campos ficticios y `Σ(quantity × unit_value)` sin clasificación, arancel o pedimento. |
| Salida | JSON Lines y el objeto final `summary`; `--filter CODE` mantiene una línea por ruta. | Interfaz simple para terminal y automatización local. |
| Descubrimiento | `--roots` y `--catalog`. | Las raíces y límites se pueden inspeccionar sin abrir XML. |
| Calidad | `tests/test_validator.py` y GitHub Actions. | Cambios pequeños con contrato ejecutable. |

## Capacidad equivalente, pero segura

El alcance se decide por la evidencia que el proyecto puede ejecutar, probar y explicar localmente. Las capacidades que exigen datos reales, credenciales, autorización o mantenimiento regulatorio se mantienen fuera del recorrido demostrable.

| Patrón de producto | Equivalente implementado | Exclusión explícita |
|---|---|---|
| Procesamiento de documentos | CLI local y `validate_file`. | Carga remota, recuperación o almacenamiento. |
| Reglas de dominio | Códigos estables, mensajes explicables y un perfil XSD estructural separado. | Validación oficial, catálogos completos o dictámenes. |
| Estructura CFDI 4.0 | Perfil XSD offline con bundle local y manifiesto de integridad. | Firma, catálogos, reglas de negocio, certificación o aceptación SAT. |
| Estado SAT | Vista previa local de la forma ConsultaCFDI. | Envío de solicitud, respuesta de estado, monitoreo o datos de contribuyentes. |
| Procesamiento por lotes | `--demo` y `--summary` sobre el corpus versionado. | Descarga masiva, expedientes reales o colas remotas. |
| Contabilidad | Catálogo, saldo y diario ficticios con `Decimal`. | DIOT, IVA, pólizas oficiales, XML de envío o reportes. |
| Comercio exterior | Envío ficticio y total local transparente. | LIGIE, NICO, tratados, aranceles, RRNA, permisos, pedimentos y despacho. |
| Integración | Diagrama y mapa estático de API/PAC/portal. | SAT/PAC, Banxico, portal, tokens, cookies, credenciales y certificados. |
| Auditoría técnica | Fixtures, pruebas unitarias y CI. | Firmas, sellos, timbrado, cancelación y modificación de documentos. |

## Preguntas que el repositorio puede responder

### ¿Cómo evitas que una extensión de contabilidad se vuelva una falsa validación fiscal?

Las tres raíces usan un namespace no resoluble y nombres de fixture explícitos. Sólo se revisan ecuaciones transparentes: identidad de cuenta, `closing = opening + debits - credits` y `sum(debit) = sum(credit)`. La documentación y los nombres de los códigos evitan cualquier afirmación de cumplimiento.

### ¿Cómo proteges el parser frente a confusiones de namespace?

El TFD se reconoce por etiqueta expandida completa. Las raíces contables requieren tanto el nombre como el namespace `https://example.invalid/fixture-ledger`; el envío sintético requiere `https://example.invalid/fixture-trade`. [`foreign-timbre.xml`](../fixtures/foreign-timbre.xml), [`foreign-ledger-root.xml`](../fixtures/foreign-ledger-root.xml) y [`foreign-trade-root.xml`](../fixtures/foreign-trade-root.xml) prueban esos límites.

### ¿Por qué no convertirlo en una plataforma fiscal completa?

Firmas, certificados, DIOT, APIs, portales, PAC y transporte exigen dependencias, autorizaciones y superficies de seguridad distintas. El producto parte de un contrato local y sólo eleva una capacidad cuando existen una fuente, una frontera y una prueba reproducible.

### ¿Cómo demostrarías extensibilidad sin sobrearquitectura?

Señala el dispatch de `validate`: una raíz nueva requiere una regla pequeña, un fixture ficticio, una aserción y documentación. No hay motor de plugins, base de datos ni dependencia que no responda a un caso educativo actual.

## Recorrido ampliado de cinco minutos

1. Explica el aviso de alcance del README y ejecuta `--roots` antes de `--demo`.
2. Usa `--filter uuid_missing` sobre dos fixtures para mostrar que el contrato conserva una línea por archivo con listas vacías cuando no hay coincidencia.
3. Ejecuta `--xsd-cfdi40 fixtures/xsd/cfdi40-xsd-valid.xml` y señala que el resultado describe una estructura XSD offline, no validez fiscal.
4. Ejecuta `--sat-status-preview` con una expresión ficticia y muestra `network: not_sent` como una frontera técnica, no como una consulta.
5. Abre [`src/cfdi_fixture_lab.py`](../src/cfdi_fixture_lab.py) y sigue `main → validate_file → validate`.
6. Compara `trial-balance-valid.xml` con `trial-balance-inconsistent.xml` y muestra el código `ledger_balance_inconsistent`.
7. Compara `journal-valid.xml` con `journal-multiple-entries-one-unbalanced.xml` y explica que el fragmento identifica `Entry 2`.
8. Compara `trade-shipment-valid.xml` con `trade-shipment-total-inconsistent.xml` y explica por qué esa suma no es un cálculo aduanero.
9. Muestra los fixtures de namespace ajeno y `multiple-timbres-one-uuid-missing.xml` para explicar identidad XML y validación independiente de cada TFD.
10. Abre [`tests/test_validator.py`](../tests/test_validator.py) y ejecuta la suite.
11. Cierra con la [guía de validación estructural CFDI 4.0](cfdi40-structural-validation.md), la [vista previa de estado SAT](sat-status-preview.md) y la [guía de comercio exterior sintético](synthetic-foreign-trade.md): el proyecto sabe qué puede demostrar y qué no debe afirmar.

## Resultado que se debe comunicar

> “Construí un núcleo local de procesamiento XML con contratos ejecutables. En vez de simular una plataforma fiscal completa, convierto cada límite regulado o externo en una exclusión documentada y una alternativa sintética comprobable. Eso hace que el código sea demostrable, seguro y fácil de extender.”

[Inicio](../README.md) · [Centro de documentación](README.md) · [Validación estructural](cfdi40-structural-validation.md) · [Vista previa de estado SAT](sat-status-preview.md) · [Contabilidad sintética](synthetic-accounting.md) · [Comercio exterior sintético](synthetic-foreign-trade.md) · [Reglas](rules.md) · [Contribuir](../CONTRIBUTING.md)
