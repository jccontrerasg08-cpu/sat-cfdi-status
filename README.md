# Consulta CFDI SAT

> Herramienta pública para consultar **un CFDI a la vez** en el servicio ConsultaCFDI del SAT. No pide cuenta, no recibe XML y no guarda RFC, UUID, importe ni sello.

## Uso

Abre la página pública, captura los cinco datos del comprobante y presiona **Consultar ante el SAT**. La aplicación valida los campos primero en el navegador y después en el servidor. Sólo si los datos tienen formato válido, el servidor envía una solicitud SOAP única al SAT.

| Dato | Clave en la expresión | Formato esperado |
|---|---|---|
| RFC emisor | `re` | RFC de 12 o 13 caracteres. |
| RFC receptor | `rr` | RFC de 12 o 13 caracteres. |
| Total | `tt` | Decimal positivo, sin separador de miles. |
| UUID | `id` | Folio fiscal UUID completo. |
| Últimos ocho del sello | `fe` | Exactamente ocho caracteres, sin espacios. |

La expresión se construye como `?re=...&rr=...&tt=...&id=...&fe=...`. Esta forma se envía dentro del elemento `expresionImpresa` de la operación SOAP `Consulta`.

## Cómo opera ConsultaCFDI

El SAT expone un endpoint HTTPS público para la operación `Consulta`. La aplicación usa `POST` con la acción SOAP `http://tempuri.org/IConsultaCFDIService/Consulta`; no usa token, certificado ni credencial. El proxy de backend existe para proteger el navegador de las restricciones de origen y para centralizar la validación, pero no tiene base de datos ni escribe registros de los identificadores enviados.

El servicio devuelve un `Acuse`. La interfaz presenta sus campos sin reinterpretarlos: `CodigoEstatus`, `Estado`, `EsCancelable`, `EstatusCancelacion` y `ValidacionEFOS`. Los errores de formato se detienen antes de abrir conexión; los errores de red, HTTP y SOAP se comunican sin reflejar los datos introducidos.

## Límites

La herramienta realiza **una consulta individual por solicitud**. No carga XML, no conserva consultas, no habilita lotes, monitoreo, cancelación, timbrado, firma ni asesoría fiscal. El Acuse es la respuesta del SAT y no constituye por sí mismo una conclusión fiscal, legal o de cumplimiento.

## Referencia oficial

Consulta el contrato publicado por el SAT en el [WSDL de ConsultaCFDI](https://consultaqr.facturaelectronica.sat.gob.mx/ConsultaCFDIService.svc). La guía oficial del servicio está disponible en [Documentación del Servicio de Consulta de CFDI](https://www.sat.gob.mx/minisitio/Factura/documentos/cancelacion/ar_consulta_cfdi.pdf).
