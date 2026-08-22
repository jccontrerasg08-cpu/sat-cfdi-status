# Contribuir a CFDI Fixture Lab

Gracias por ayudar a mantener un laboratorio pequeño, claro y seguro. Antes de proponer una modificación, revisa el [README](README.md), los [límites de arquitectura](docs/architecture.md) y el [catálogo de reglas](docs/rules.md).

> El objetivo no es construir un validador fiscal completo. El objetivo es añadir el ejemplo educativo más pequeño que explique una condición observable usando XML totalmente ficticio y ejecución local.

## Principios de contribución

| Principio | Significado práctico |
|---|---|
| **Un escenario, una lección** | Cada fixture debe responder una sola pregunta de aprendizaje. |
| **Local por defecto** | No introduzcas red, credenciales, PAC ni servicios externos; la única excepción es el cliente público `--sat-status`, invocado explícitamente y sin persistencia. |
| **No mutación** | El validador explica el XML; no lo limpia, corrige ni reescribe. |
| **Código antes que texto** | Todo resultado nuevo necesita un código estable y una prueba. |
| **Pocas dependencias** | Reutiliza la biblioteca estándar salvo que exista un caso concreto imposible de cubrir. |
| **Documentación como contrato** | Un cambio de comportamiento actualiza regla, fixture, prueba y guía en el mismo cambio. |

## Añadir una regla

Antes de escribir código, confirma que no existe ya una regla que cubra el caso. Una regla nueva debe ser una condición local, explicable y verificable en un fixture ficticio.

1. Define una frase de propósito educativo y los campos de salida: `code`, `rule`, `message` y `fragment`.
2. Crea el fixture mínimo que active solamente esa condición.
3. Añade la regla al flujo existente de `validate` en `src/cfdi_fixture_lab.py`; evita marcos, registries o plugins si una condición directa basta.
4. Escribe una prueba enfocada en `tests/test_validator.py` que compruebe el código y el dato visible más relevante.
5. Documenta el código en [`docs/rules.md`](docs/rules.md) y enlaza el fixture en [`docs/fixtures.md`](docs/fixtures.md).
6. Ejecuta la verificación local completa.

### Criterio de aceptación

| Debe ocurrir | No debe ocurrir |
|---|---|
| El nuevo fixture es completamente ficticio. | Añadir información de contribuyentes, certificados, sellos o comprobantes reales. |
| Una prueba falla si la regla o el contrato SOAP cambian de forma no intencional. | Comparar texto interno irrelevante, depender de orden fiscal o consultar al SAT en una prueba. |
| La documentación explica el propósito y el límite. | Afirmar que el repositorio certifica validez o cumplimiento. |
| La salida sigue siendo JSON Lines por ruta. | Introducir un formato o dependencia sin un caso que lo justifique. |

## Añadir un fixture

Usa `fixtures/minimal.xml` como forma conceptual, no como documento de negocio. Mantén el XML corto y cambia sólo lo necesario para expresar el escenario.

| Antes de terminar | Pregunta de revisión |
|---|---|
| Nombre | ¿El nombre explica la condición, por ejemplo `uuid-missing.xml`? |
| Datos | ¿Todo valor es inventado y no puede confundirse con un documento real? |
| Foco | ¿El fixture activa una sola lección principal? |
| Prueba | ¿Existe una aserción enfocada en el resultado visible? |
| Guía | ¿`docs/fixtures.md` explica la pregunta y resultado esperado? |

## Verificación local

Ejecuta desde la raíz del repositorio:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -v
PYTHONDONTWRITEBYTECODE=1 python3 src/cfdi_fixture_lab.py fixtures/*.xml
```

Antes de compartir documentación nueva, comprueba que todos los enlaces relativos existen y que cada diagrama Mermaid de `docs/diagrams/` se puede renderizar. Para cambios de Markdown, también es útil ejecutar:

```bash
git diff --check
```

## Dependencias y referencias externas

No copies código ni añadas paquetes por analogía. Si un cambio parece necesitar un proyecto externo, documenta primero el caso que la biblioteca estándar no puede resolver. La [matriz de adopción](DETAILED_ADOPTION_MATRIX.md) ya registra decisiones sobre referencias CFDI y muestra por qué el proyecto no incluye `lxml`, XML repair, firmas, XSD embebidos o conectividad fiscal.

Si se propone reutilizar código externo, conserva la fuente, revisión y licencia; comprueba que la licencia permite la incorporación y añade una prueba que demuestre el comportamiento requerido. La revisión de licencia debe tratarse como una decisión técnica preliminar, no como asesoría jurídica.

## Alcance que no se acepta

No se aceptan cambios que añadan timbrado, firma, certificados, e.firma, autenticación, descargas, cargas, datos reales en fixtures, integración PAC, VUCEM u otro servicio remoto, validación oficial, asesoría fiscal, reparación XML, normalización automática o escaneo masivo de archivos. El único transporte admitido es la consulta pública SAT individual ya documentada, sin persistencia ni automatización. Esas capacidades excluidas convierten el laboratorio en otro producto con obligaciones y riesgos distintos.

[Inicio](README.md) · [Centro de documentación](docs/README.md) · [Arquitectura](docs/architecture.md) · [Reglas](docs/rules.md) · [Fixtures](docs/fixtures.md) · [Salida](docs/output.md)
