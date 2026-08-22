<div align="center">

<img src="docs/assets/fixture-lab-banner.png" alt="CFDI Fixture Lab: un laboratorio local de XML sintético y reglas explicables" width="100%" />

# CFDI Fixture Lab

### Laboratorio local para aprender con XML sintético, reglas pequeñas y resultados explicables

[![Tests](https://github.com/jccontrerasg08-cpu/cfdi-fixture-lab/actions/workflows/test.yml/badge.svg)](https://github.com/jccontrerasg08-cpu/cfdi-fixture-lab/actions/workflows/test.yml)
[![Python + lxml](https://img.shields.io/badge/Python%20%2B%20lxml-offline%20XSD-3776AB?logo=python&logoColor=white)](requirements.txt)
[![Alcance](https://img.shields.io/badge/alcance-local%20y%20educativo-0F766E)](docs/architecture.md)
[![Fixtures](https://img.shields.io/badge/fixtures-100%25%20sint%C3%A9ticos-7C3AED)](docs/fixtures.md)
[![Salida](https://img.shields.io/badge/salida-JSON%20Lines-111827)](docs/output.md)

**[Demostración](#demostración-de-entrevista)** · **[Empezar](#inicio-rápido)** · **[Catálogo local](#catálogo-de-capacidades)** · **[Validación XSD](docs/cfdi40-structural-validation.md)** · **[Consulta SAT](docs/sat-status-preview.md)** · **[Perspectivas](docs/system-perspectives.md)** · **[Evaluación opcional](#evaluación-opcional-de-herramientas-locales)** · **[Documentación](docs/README.md)** · **[Reglas](docs/rules.md)** · **[Fixtures](docs/fixtures.md)** · **[Contabilidad sintética](docs/synthetic-accounting.md)** · **[Comercio exterior sintético](docs/synthetic-foreign-trade.md)** · **[Límite de verificación](docs/verifier-boundary.md)** · **[Arquitectura](docs/architecture.md)** · **[Contrato JSON](docs/output.md)** · **[Corpus público](docs/public-corpus-policy.md)** · **[FAQ](docs/faq.md)** · **[Contribuir](CONTRIBUTING.md)**

</div>

> [!IMPORTANT]
> **CFDI Fixture Lab no es un validador oficial y no certifica cumplimiento.** Cada fixture es ficticio y permanece local; la opción `--sat-status` sólo envía una expresión de consulta cuando se solicita de forma explícita.

> [!NOTE]
> **Laboratorio educativo, no producto desplegable.** La aplicación pública canónica para consultar el Acuse del SAT vive en [sat-cfdi-status](https://github.com/jccontrerasg08-cpu/sat-cfdi-status). Este repositorio conserva fixtures, reglas y demostraciones locales; no debe conectarse a Vercel ni mezclarse con el ciclo de publicación de la aplicación web.

## Qué resuelve

CFDI Fixture Lab convierte un conjunto pequeño de XML de ejemplo en una conversación concreta sobre validación: cada archivo representa una situación educativa, cada regla devuelve un código estable y cada resultado incluye el fragmento que orienta la lectura. No hay timbrado, credenciales, certificados, e.firma ni corrección automática de documentos. Como excepción aislada, `--sat-status` consulta una expresión impresa en el servicio público del SAT, sin enviar XML ni guardar los identificadores.

| Propiedad | Cómo se materializa |
|---|---|
| **Local por defecto** | `xml.etree.ElementTree` analiza archivos desde disco; sólo `--sat-status` abre una conexión pública tras una invocación explícita. |
| **Ficticio por contrato** | Los treinta y un XML de `fixtures/` sólo contienen valores de laboratorio. |
| **Explicable** | Cada problema contiene `code`, `rule`, `message` y `fragment`. |
| **Reproducible** | `unittest` fija un resultado esperado por cada fixture. |
| **Deliberadamente acotado** | Una CLI, reglas educativas y un perfil XSD local con una dependencia explícita. |

## El recorrido del laboratorio

<p align="center">
  <img src="docs/assets/validation-overview.png" alt="Resumen del flujo local: fixture sintético, lectura estricta, reglas educativas y salida JSON Lines" width="920" />
</p>

El flujo no altera el XML. Si el archivo no se puede leer, el laboratorio reporta `xml_parse_error`; si se puede leer, aplica únicamente las reglas descritas en [`docs/rules.md`](docs/rules.md). Consulta el [diagrama detallado y los límites de arquitectura](docs/architecture.md) para ramas de error, pruebas y decisiones de diseño.

## Demostración de entrevista

```bash
python3 src/cfdi_fixture_lab.py --demo
```

Este comando no acepta XML externo: ejecuta los 31 fixtures sintéticos incluidos y añade el resumen JSON Lines final. Es la forma más corta de recorrer parseo, despacho de raíces, reglas CFDI, aritmética contable ficticia y contratos de salida en una entrevista. El [guion de demostración](docs/interview-demo.md) incluye una narrativa de 90 segundos, un recorrido de cinco minutos y preguntas técnicas defendibles.

## Inicio rápido

Las reglas educativas se ejecutan con Python; el perfil XSD local usa la dependencia fijada `lxml`. Desde la raíz del repositorio:

```bash
pip install -r requirements.txt
python3 src/cfdi_fixture_lab.py fixtures/minimal.xml fixtures/uuid-missing.xml
python3 src/cfdi_fixture_lab.py fixtures/trial-balance-inconsistent.xml fixtures/journal-unbalanced.xml
python3 src/cfdi_fixture_lab.py --summary fixtures/*.xml
python3 src/cfdi_fixture_lab.py --filter uuid_missing fixtures/*.xml
python3 src/cfdi_fixture_lab.py --filter uuid_missing --filter unsupported_complement --summary fixtures/*.xml
python3 src/cfdi_fixture_lab.py --roots
python3 src/cfdi_fixture_lab.py --catalog
python3 src/cfdi_fixture_lab.py --xsd-cfdi40 fixtures/xsd/cfdi40-xsd-valid.xml
python3 src/cfdi_fixture_lab.py --sat-status-preview '?re=AAA010101AAA&rr=XAXX010101000&tt=100.00&id=123e4567-e89b-12d3-a456-426614174000&fe=ABC12345'
python3 src/cfdi_fixture_lab.py --sat-status '?re=<RFC_EMISOR>&rr=<RFC_RECEPTOR>&tt=<TOTAL>&id=<UUID>&fe=<ULTIMOS_8_SELLO>'
python3 -m unittest discover -s tests -v
```

La primera orden escribe **una línea JSON por fixture**. Por ejemplo, el fixture limpio no emite advertencias:

```json
{"file": "fixtures/minimal.xml", "issues": []}
```

El fixture con un `TimbreFiscalDigital` sin UUID genera una advertencia identificable:

```json
{
  "file": "fixtures/uuid-missing.xml",
  "issues": [
    {
      "code": "uuid_missing",
      "rule": "timbre_uuid_present",
      "message": "El TimbreFiscalDigital sintético no contiene UUID.",
      "fragment": "<TimbreFiscalDigital UUID=...>"
    }
  ]
}
```

El contrato completo, incluidos los códigos y la semántica de una lista vacía, está en [`docs/output.md`](docs/output.md). La opción local `--summary` agrega al final un recuento por código, sin sustituir la línea individual de cada fixture; `--filter CODE` conserva las rutas y muestra sólo los issues coincidentes. Usa `--roots` para leer las cinco raíces y sus lecciones en texto humano, o `--catalog` para inspeccionar el contrato completo en JSON.

## Catálogo de capacidades

```bash
python3 src/cfdi_fixture_lab.py --roots
python3 src/cfdi_fixture_lab.py --catalog
```

`--roots` no abre XML y muestra en texto las cinco raíces didácticas, sus namespaces y la lección asociada. `--catalog` tampoco abre XML ni ejecuta reglas, pero emite un solo objeto JSON con el alcance, política de transporte, forma de salida, raíces, namespaces sintéticos y códigos de regla que la versión expone. Juntas, ambas vistas permiten que una demo, una herramienta local o una persona inspeccione el contrato antes de procesar un fixture. El formato completo y los modos exclusivos se documentan en [`docs/output.md`](docs/output.md).

El catálogo también declara los perfiles estructurales y módulos de producto: `cfdi_4_0_xsd` está implementado de forma offline; `sat_status` valida localmente una expresión y, sólo con `--sat-status`, envía una consulta pública individual al SAT; contabilidad electrónica, nómina y comercio exterior profesional permanecen como módulos de hoja de ruta.

La [revisión del corpus público](docs/public-corpus-review.md) muestra cómo se evaluó un subconjunto de fixtures de prueba de GitHub sin conservar XML externo ni comprobar documentos reales. La [contabilidad sintética](docs/synthetic-accounting.md) añade tres raíces locales para enseñar identidad de cuenta, saldo y equilibrio sin implementar contabilidad electrónica, DIOT ni servicios externos. El [comercio exterior sintético](docs/synthetic-foreign-trade.md) enseña campos de envío y una suma local, sin clasificar mercancías, calcular aranceles ni preparar pedimentos.

## Evaluación opcional de herramientas locales

El validador principal conserva su contrato de **cero dependencias externas**. Para comparar herramientas de inspección CFDI sin ampliar ese núcleo, [`docs/tool-evaluation.md`](docs/tool-evaluation.md) documenta una evaluación aislada de `satcfdi` y `lxml`: ambos caminos se probaron únicamente con XML sintético local, sin llamadas de red, credenciales, certificados, timbrado ni consultas SAT/PAC. La evaluación vive en `tools/` y no participa en `--demo` ni en la suite estándar.

```bash
python3 -m venv .venv-cfdi-eval
. .venv-cfdi-eval/bin/activate
python -m pip install "satcfdi==26.7.4" "lxml==6.1.1"
python tools/evaluate_local_cfdi_tools.py
```

El comando imprime una evidencia JSON local. Las herramientas de firma, timbrado, consulta de estatus, descarga masiva o portal se documentan como exclusiones porque requieren red, credenciales o datos de terceros.

## Elige tu recorrido

| Si necesitas… | Lee… | Resultado |
|---|---|---|
| Ejecutar un fixture y entender la salida | [Inicio rápido](#inicio-rápido) y [contrato JSON](docs/output.md) | Un comando local y una lectura precisa de `issues`. |
| Mostrar sólo una clase de advertencia | [Contrato JSON: filtros](docs/output.md#filtrar-códigos-de-issue) | `--filter CODE` conserva una línea por ruta y sólo los issues coincidentes. |
| Ver las raíces antes de ejecutar XML | [Catálogo de capacidades](#catálogo-de-capacidades) y [contrato JSON: raíces](docs/output.md#raíces-admitidas-en-texto) | `--roots` entrega las cinco raíces, namespaces y lecciones en texto. |
| Inspeccionar la superficie de la CLI | [Catálogo de capacidades](#catálogo-de-capacidades) | `--catalog` entrega raíces, namespaces, códigos y límites en un objeto local. |
| Consultar el estado oficial de un CFDI | [Consulta de estatus SAT](docs/sat-status-preview.md) | `--sat-status` envía una expresión única y devuelve los campos oficiales del acuse sin interpretarlos. |
| Mostrar el proyecto de punta a punta | [Guion de demostración](docs/interview-demo.md) | `--demo`, narrativa técnica, matriz de alcance y preguntas de entrevista. |
| Entender una regla educativa | [Reglas](docs/rules.md) | Alcance, disparador, código y ejemplo para cada regla. |
| Ver qué representa cada XML | [Guía de fixtures](docs/fixtures.md) | Una matriz de escenario, XML y resultado esperado. |
| Aprender aritmética contable ficticia | [Contabilidad sintética](docs/synthetic-accounting.md) | Catálogo, balanza y diario locales, explícitamente no oficiales. |
| Enseñar un flujo de comercio exterior seguro | [Comercio exterior sintético](docs/synthetic-foreign-trade.md) | Envío ficticio, `Decimal` y total local; sin LIGIE, aranceles, tratados ni pedimento. |
| Entender la evolución profesional del producto | [Hoja de ruta profesional](PROFESSIONAL_PRODUCT_ROADMAP.md) | Módulos, límites de autorización y etapas de construcción. |
| Revisar el flujo y sus límites | [Arquitectura](docs/architecture.md) | Un modelo de componentes y una frontera clara de seguridad. |
| Confirmar los datos que el laboratorio pide y excluye | [Preguntas frecuentes](docs/faq.md) | La diferencia explícita frente a verificadores CFDI de consulta en tiempo real. |
| Comparar UX local y verificación en tiempo real | [Límite de verificación](docs/verifier-boundary.md) | Equivalentes seguros, exclusiones y una explicación lista para entrevista. |
| Añadir un caso nuevo sin expandir el producto | [Contribuir](CONTRIBUTING.md) | Un flujo de cambio pequeño, verificable y seguro. |

## Reglas actualmente incluidas

| Código | Situación de laboratorio | Resultado educativo |
|---|---|---|
| `unexpected_root` | El elemento raíz no es una de las formas didácticas admitidas. | Señala que el fixture está fuera del contrato local. |
| `required_attribute_missing` | Falta un atributo mínimo o está vacío. | Identifica el atributo ausente. |
| `fecha_invalid` | `Fecha` no tiene un formato ISO 8601 que el laboratorio pueda leer. | Explica el formato que no se pudo interpretar. |
| `fecha_inconsistent` | Un XML con `Version="4.0"` usa una fecha anterior a la ventana educativa. | Señala `Version` y `Fecha`. |
| `uuid_missing` | Un `TimbreFiscalDigital` reconocido no contiene UUID. | Muestra el fragmento de atributo esperado. |
| `unsupported_complement` | El fixture incluye un complemento fuera del alcance declarado. | Nombra el complemento sin modificarlo. |
| `xml_parse_error` | El archivo no se puede leer como XML. | Devuelve el error local de lectura o parseo. |
| `ledger_account_*` | Una cuenta ficticia está incompleta o repetida. | Explica identidad de cuenta local. |
| `ledger_balance_*` | Un importe o saldo ficticio no respeta la identidad aritmética. | Explica `Decimal` y la ecuación de saldo. |
| `journal_entry_*` / `journal_amount_invalid` | Un asiento no tiene líneas, tiene importes ilegibles o no se equilibra. | Explica la suma local de cargos y abonos. |
| `trade_*` | Un envío ficticio tiene campos, importes o total local inválidos. | Explica namespace, `Decimal` y suma; no comercio exterior real. |

Los treinta y un escenarios incluyen nueve casos CFDI, once casos de contabilidad sintética, siete casos de comercio exterior sintético y cuatro fronteras de parseo o namespace que evitan que entradas ajenas activen los parsers locales.

> Las reglas son **reglas de laboratorio**, no una afirmación de validez fiscal vigente. La fuente de verdad de este repositorio es su propia documentación, fixtures y pruebas; no sustituye documentación, catálogos o esquemas oficiales.

## Límites explícitos

<p align="center">
  <img src="docs/assets/scope-boundary.png" alt="Frontera de alcance: dentro, fixtures sintéticos, parser local y advertencias; fuera, documentos reales, sellos, timbrado, red, SAT y PAC" width="920" />
</p>

| Incluido | Excluido deliberadamente |
|---|---|
| XML ficticio versionado | Comprobantes, RFC, certificados o sellos reales |
| Lectura local y avisos educativos | Timbrado, firma, descarga, carga, PAC o conexión SAT distinta de `--sat-status` |
| Consulta SAT individual, explícita y sin persistencia | Certificación, diagnóstico fiscal, asesoría, consultas masivas o monitoreo |
| Pruebas offline y aritmética `Decimal` de fixtures | Corrección, normalización o mutación del XML de entrada |
| Catálogo, balanza y diario ficticios | Contabilidad electrónica, DIOT, declaraciones, IVA o reportes oficiales |
| Envío ficticio y suma local | LIGIE, aranceles, tratados, pedimentos, RRNA, permisos o despacho aduanal |

## Estructura del repositorio

```text
src/
├── cfdi_fixture_lab.py    # reglas, CLI y perfiles locales
├── cfdi_schema_validation.py # perfil XSD CFDI 4.0 offline
└── cfdi_sat_status.py     # previsualización y consulta pública opcional de ConsultaCFDI
fixtures/
├── *.xml                  # escenarios XML sintéticos
├── xsd/                    # fixtures estructurales CFDI 4.0
└── README.md              # guía breve de fixtures
schemas/cfdi40/             # bundle XSD local y manifiesto de integridad
tests/
└── test_validator.py      # contrato ejecutable por escenario
docs/
├── README.md              # centro de documentación
├── architecture.md        # componentes, flujo y límites
├── rules.md               # catálogo de reglas
├── fixtures.md            # guía de escenarios
├── output.md              # contrato JSON Lines, resumen y catálogo local
├── public-corpus-policy.md # límites para fixtures públicos temporales
├── public-corpus-review.md # resultado agregado de compatibilidad
├── synthetic-accounting.md # contabilidad didáctica local
├── cfdi40-structural-validation.md # perfil XSD local, manifiesto y límites
├── sat-status-preview.md  # previsualización y consulta pública opcional de ConsultaCFDI
├── interview-demo.md      # guion y flujo para entrevista
├── synthetic-foreign-trade.md # envío ficticio y límite aduanal explícito
├── verifier-boundary.md   # equivalentes locales y exclusiones de verificación
├── diagrams/              # fuentes Mermaid deterministas
└── assets/                # banner y diagramas renderizados
CONTRIBUTING.md            # flujo de contribución
```

## Verificación

La comprobación mínima del repositorio es la suite offline; el mismo comando se ejecuta en GitHub Actions para cada cambio en `main` y cada pull request.

```bash
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -v
```

Las reglas no son aceptadas por descripción solamente: cada una debe tener un fixture ficticio y una aserción enfocada. Consulta [`CONTRIBUTING.md`](CONTRIBUTING.md) antes de ampliar el alcance.

## Documentación

El análisis de adopción de referencias CFDI permanece disponible en [`DETAILED_ADOPTION_MATRIX.md`](DETAILED_ADOPTION_MATRIX.md).

[Centro de documentación](docs/README.md) · [Hoja de ruta profesional](PROFESSIONAL_PRODUCT_ROADMAP.md) · [Guion de entrevista](docs/interview-demo.md) · [Límite de verificación](docs/verifier-boundary.md) · [Validación estructural CFDI 4.0](docs/cfdi40-structural-validation.md) · [Vista previa de estado SAT](docs/sat-status-preview.md) · [Reglas](docs/rules.md) · [Fixtures](docs/fixtures.md) · [Contabilidad sintética](docs/synthetic-accounting.md) · [Comercio exterior sintético](docs/synthetic-foreign-trade.md) · [Arquitectura](docs/architecture.md) · [Salida](docs/output.md) · [Corpus público](docs/public-corpus-policy.md) · [FAQ](docs/faq.md) · [Contribuir](CONTRIBUTING.md)
