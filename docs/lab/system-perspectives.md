# Perspectivas conectadas: macro y micro

Esta guía reúne las capas que normalmente se leen por separado: la experiencia de una persona que explora el proyecto, el proceso local que produce evidencia, las reglas que explican un resultado y los límites que evitan confundir el laboratorio con un servicio fiscal. Empieza con la vista macro y baja hasta la ejecución de una sola ruta o de una evaluación opcional.

| Orden | Perspectiva | Pregunta que responde | Diagrama |
|---:|---|---|---|
| 1 | **Sistema** | ¿Cómo se conectan sitio, repositorio, CLI, fixtures, tests y documentación? | [Macro sistema](#1-el-sistema-completo) |
| 2 | **Frontera** | ¿Qué puede hacer el laboratorio y qué se excluye de forma explícita? | [Frontera local](#2-la-frontera-que-da-significado) |
| 3 | **Ejecución** | ¿Cómo termina una ruta local como JSON Lines explicable? | [Despacho de validación](#3-el-recorrido-micro-de-una-ruta) |
| 4 | **Comparación** | ¿Cómo se prueban herramientas opcionales sin alterar el núcleo ni abrir red? | [Evaluación aislada](#4-la-evaluación-opcional-sin-cruzar-la-frontera) |

> Una salida sin `issues` significa solamente que el fixture no activó las reglas implementadas. No es validación oficial, certificación, timbrado ni asesoría fiscal.

## 1. El sistema completo

![Diagrama macro del sistema de evidencia](assets/diagrams/01-macro-system.png)

La lectura empieza en dos entradas complementarias. El **sitio** permite explorar el corpus, copiar comandos y seguir referencias; el **repositorio** permite revisar fuente, fixtures, pruebas y CI. La ejecución ocurre fuera del navegador, en una máquina local: el CLI lee fixtures sintéticos, produce JSON Lines y queda protegido por pruebas enfocadas. Esa salida, junto con las reglas y los diagramas, vuelve al lector como evidencia inspeccionable.

La idea clave es un ciclo, no una pantalla aislada: **documentación explica el código, código procesa fixtures, pruebas fijan el contrato y el sitio hace visible esa cadena**.

## 2. La frontera que da significado

![Diagrama de frontera local y exclusiones](assets/diagrams/02-local-boundary.png)

La frontera no es una nota al pie. Es una condición de interpretación. Dentro están XML ficticio en disco, parseo estricto, cinco raíces didácticas, reglas pequeñas, JSON Lines y evidencia offline. Fuera quedan facturas reales, credenciales, certificados, e.firma, SAT, PAC, VUCEM, timbrado, firma, consulta de estado y recuperación.

Esto permite hacer una afirmación precisa: el proyecto puede demostrar **cómo se modela una decisión técnica local**, pero no puede afirmar que una factura sea fiscalmente válida ni operar procesos fiscales.

## 3. El recorrido micro de una ruta

![Diagrama micro del despacho de validación](assets/diagrams/03-validation-dispatch.png)

El microflujo muestra dos caminos de descubrimiento (`--roots` y `--catalog`) que no abren XML, y el camino de ejecución por rutas o `--demo`. Una ruta pasa por `ElementTree.parse`; un error de XML termina inmediatamente en `xml_parse_error`. Sólo una raíz legible llega al despacho por nombre local.

Las cinco ramas cubren CFDI estructural, catálogo contable, balanza, diario y envío de comercio exterior sintético. Todas convergen en `list[Issue]`, que conserva `code`, `rule`, `message` y `fragment`. `--filter` reduce los issues emitidos sin eliminar la línea del archivo; `--summary` y `--demo` añaden al final una síntesis de archivos, issues y códigos.

## 4. La evaluación opcional sin cruzar la frontera

![Secuencia de la evaluación opcional de herramientas](assets/diagrams/04-optional-tool-evaluation.png)

La evaluación de [`satcfdi` y `lxml`](tool-evaluation.md) no convierte esas bibliotecas en requisitos del CLI. Se instala en un entorno virtual aislado y usa tres fixtures sintéticos: uno completo para el modelo de `satcfdi`, uno mínimo para XPath y uno malformado para confirmar el rechazo local.

El resultado aprobado declara `network_calls: 0`, `credentials_used: false` y el estado de ambas rutas. El diagrama hace visible el hecho importante: el flujo finaliza en evidencia JSON local y no cruza hacia SAT/PAC, credenciales, firma, timbrado, consulta o descarga.

## Cómo usar las cuatro vistas

| Si necesitas… | Empieza por | Continúa con |
|---|---|---|
| Presentar el proyecto en pocos minutos | Sistema completo | Frontera local |
| Entender un código de issue | Recorrido micro | [Reglas](rules.md) y [fixtures](fixtures.md) |
| Revisar por qué no existe una integración remota | Frontera local | [Límite de verificación](verifier-boundary.md) |
| Probar inspectores XML alternativos de manera segura | Evaluación aislada | [Guía de evaluación](tool-evaluation.md) |
| Verificar una modificación | Recorrido micro | [Pruebas](../tests/test_validator.py) y GitHub Actions |

Las fuentes Mermaid se conservan en [`docs/diagrams/`](diagrams/README.md), y las imágenes renderizadas en [`docs/assets/diagrams/`](assets/diagrams/). Mantener ambas versiones permite leer los diagramas directamente y auditar sus relaciones como texto controlado por versiones.

[Inicio](../README.md) · [Centro de documentación](README.md) · [Arquitectura](architecture.md) · [Límite de verificación](verifier-boundary.md) · [Evaluación de herramientas](tool-evaluation.md)
