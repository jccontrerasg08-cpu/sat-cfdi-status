# Evaluación opcional de herramientas CFDI locales

Esta guía mantiene una separación deliberada: el validador principal de CFDI Fixture Lab sigue usando exclusivamente la biblioteca estándar de Python. La evaluación descrita aquí es **opcional**, se ejecuta fuera de la suite principal y sirve para comparar dos rutas locales contra XML completamente sintético.

> No ejecutes estos comandos sobre XML reales. La evaluación no contacta SAT, PAC, portales, servicios de descarga, timbrado ni firma; no usa RFC reales, certificados, e.firma, contraseñas ni credenciales.

## Herramientas evaluadas

| Herramienta | Ruta local verificada | No se evalúa |
|---|---|---|
| Biblioteca estándar / `ElementTree` | Motor principal del laboratorio para parseo, despacho y reglas educativas. | XSD oficial completo, firma, timbrado o servicios remotos. |
| [`satcfdi` 26.7.4](https://pypi.org/project/satcfdi/) | Carga un CFDI 4.0 sintético completo y expone su raíz y versión en memoria. | PAC, portal SAT, certificados, sello, descarga masiva o URL de verificación. |
| [`lxml` 6.1.1](https://lxml.de/) | Abre un CFDI sintético local, consulta atributos con XPath y rechaza el fixture XML malformado. | Descarga de XSD, resolución de entidades externas o afirmaciones de certificación fiscal. |

La fixture adicional en [`tools/fixtures/complete-synthetic-cfdi40.xml`](../tools/fixtures/complete-synthetic-cfdi40.xml) contiene los nodos que necesita el modelo de `satcfdi`. No forma parte del corpus de `--demo`: el corpus principal conserva fixtures mínimos, una regla por escenario y cero dependencias externas.

## Ejecutar la evaluación aislada

```bash
python3 -m venv .venv-cfdi-eval
. .venv-cfdi-eval/bin/activate
python -m pip install "satcfdi==26.7.4" "lxml==6.1.1"
python tools/evaluate_local_cfdi_tools.py
```

Una ejecución aprobada imprime JSON con `network_calls: 0`, `credentials_used: false`, el detalle de los tres fixtures sintéticos y estado `passed` para `satcfdi` y `lxml`.

## Candidatos revisados, pero excluidos

Los recursos XSD oficiales se pueden evaluar localmente sólo si se versiona el árbol de esquemas y se desactiva toda descarga; no se añaden aquí para evitar presentar validez estructural como certificación fiscal. Las bibliotecas PHP como CfdiUtils son candidatas de evaluación local separada, pero no se ejecutan en este repositorio Python. Herramientas de timbrado, firma con certificados, consulta de estatus SAT/PAC, recuperación de facturas y portales se excluyen porque requieren red, credenciales, datos de terceros o una afirmación que este laboratorio no puede sostener.

[Inicio](../README.md) · [Centro de documentación](README.md) · [Arquitectura](architecture.md) · [Límite de verificación](verifier-boundary.md)
