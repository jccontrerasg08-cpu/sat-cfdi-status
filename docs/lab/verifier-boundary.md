# Comparación con un verificador CFDI en tiempo real

CFDI Fixture Lab toma como inspiración la **claridad del recorrido** de un verificador público: una entrada identificable, un resultado legible, una ruta por lote y preguntas frecuentes. No intenta reproducir su operación ni afirmar equivalencia funcional.

> El verificador público revisado pide UUID, RFC de emisor, RFC de receptor y total, y declara una consulta directa al SAT en tiempo real [1]. CFDI Fixture Lab no recibe, conserva, transmite ni consulta esos valores.

## Equivalentes seguros

| Patrón visible | Equivalente local en CFDI Fixture Lab | Beneficio demostrable |
|---|---|---|
| Verificación individual | `python3 src/cfdi_fixture_lab.py fixtures/minimal.xml` | Un XML ficticio entra, se parsea y produce JSON Lines explicable. |
| Verificación por lote | `python3 src/cfdi_fixture_lab.py --summary fixtures/*.xml` | Una línea por fixture más recuento estable por código. |
| Flujo listo para mostrar | `python3 src/cfdi_fixture_lab.py --demo` | Recorre los 31 fixtures versionados sin aceptar archivos externos. |
| Explicación de resultados | `code`, `rule`, `message` y `fragment` | El lector puede unir una condición con una regla y un fixture. |
| Preguntas frecuentes | [`faq.md`](faq.md) y guías por dominio | Límites visibles antes de asumir capacidades no implementadas. |
| Historial | Ninguno | No hay persistencia, perfiles, cookies ni expedientes de documentos. |

## Exclusiones decisivas

| El laboratorio no hace | Razón de diseño |
|---|---|
| Solicitar UUID, RFC, total, PDF o XML real | El objetivo es evitar datos de terceros y limitar la entrada al corpus sintético. |
| Consultar SAT, EFOS, cancelación o vigencia | Requiere servicios externos, datos en tiempo real y una interpretación que excede un laboratorio educativo. |
| Mantener historial local o remoto | Evita convertir resultados de ejemplo en expedientes de facturas. |
| Emitir dictámenes, alertas fiscales o asesoría | Un `Issue` sólo describe una regla del repositorio; no es un estatus fiscal. |
| Corregir, timbrar, cancelar, firmar o enviar CFDI | Protege la inmutabilidad de los fixtures y evita operaciones reguladas. |

## Guion de entrevista

> “Un verificador de producción necesita datos sensibles, conectividad, disponibilidad externa y una postura clara frente a resultados regulatorios. En este proyecto separé la experiencia de usuario de esas dependencias: demuestro entrada, validación, lote, reporte y calidad con fixtures sintéticos, contratos ejecutables y cero red. Por eso cada capacidad que excluyo está documentada, no escondida.”

La demostración se complementa con [`interview-demo.md`](interview-demo.md), el [contrato JSON Lines](output.md), las [reglas](rules.md) y la [arquitectura](architecture.md).

## Referencias

[1]: https://sdv.com.mx/herramientas/verificador-cfdi/ "Verificador de CFDI Gratis — SDV Asesores"

[Inicio](../README.md) · [Centro de documentación](README.md) · [Guion de entrevista](interview-demo.md) · [FAQ](faq.md) · [Arquitectura](architecture.md) · [Salida](output.md)
