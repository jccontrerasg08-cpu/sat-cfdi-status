# Política del corpus público de fixtures

Este documento define cómo CFDI Fixture Lab puede aprender de ejemplos públicos sin convertir el repositorio en un almacén de comprobantes de terceros. El objetivo es medir la compatibilidad de sus reglas **educativas y locales**, no validar CFDI reales ni construir una colección de documentos fiscales.

> La frase “todos los CFDI de GitHub” no describe un corpus finito ni seguro. Este proyecto evalúa un **corpus reproducible de fixtures de prueba elegibles** descubierto mediante búsquedas públicas de GitHub, con una política explícita de exclusión.

## Elegibilidad

Un archivo XML puede evaluarse temporalmente sólo si cumple todos los criterios siguientes:

| Criterio | Requisito |
|---|---|
| Repositorio | Público, no forkeado por este proyecto y con revisión fija de commit. |
| Licencia | Licencia abierta identificable y compatible con la inspección de pruebas; el archivo nunca se copia al repositorio. |
| Ubicación | Directorio de tests, fixtures, samples o testdata con intención de prueba evidente. |
| Naturaleza | Ejemplo claramente sintético, anonimizado o creado para pruebas. |
| Riesgo de datos | No debe contener evidencia de comprobante real, personas, empresas, RFC de terceros, certificados, sellos o datos que el proyecto no admite. |
| Propósito | Debe aportar una forma XML o un complemento que ayude a medir comportamiento local. |

La ausencia de un criterio basta para excluir un archivo. El proceso prefiere falsos negativos de inclusión antes que conservar datos inseguros.

## Proceso de evaluación

1. Se descubren repositorios públicos por metadatos y se fija una revisión exacta.
2. Se clona el candidato de forma temporal y sólo para lectura; no se crea fork.
3. Se inventaría la ubicación de fixtures y se revisa cada candidato antes de ejecutarlo.
4. El validador local se ejecuta contra los fixtures elegibles. No se suben archivos, resultados ni rutas a servicios externos.
5. Se conserva únicamente un resumen agregado: repositorio, revisión, licencia, número de XML elegibles y códigos observados.
6. Los clones y archivos externos se eliminan al terminar. No se añaden XML externos al historial de este proyecto.

## Límites del resultado

| El informe puede afirmar | El informe no puede afirmar |
|---|---|
| Qué códigos educativos emitió el validador para un corpus de prueba específico. | Que una factura real es válida, vigente, cancelada o cumple requisitos fiscales. |
| Qué forma XML o namespace motivó una prueba sintética nueva. | Que el corpus representa todos los CFDI de GitHub, del SAT o de producción. |
| Qué cambio local mejora el manejo de un fixture explícitamente sintético. | Que una librería sustituye fuentes, esquemas o servicios oficiales. |

## Tratamiento de hallazgos

Un hallazgo sólo se convierte en funcionalidad si se puede expresar como una regla local pequeña, un fixture nuevo completamente ficticio, una prueba enfocada y una explicación en [`rules.md`](rules.md). La fuente externa se acredita en el informe de compatibilidad, pero su XML nunca se copia ni se distribuye aquí.

[Inicio](../README.md) · [Centro de documentación](README.md) · [Arquitectura](architecture.md) · [Reglas](rules.md) · [Guía de fixtures](fixtures.md)
