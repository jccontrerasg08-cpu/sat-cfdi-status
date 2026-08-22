# Consulta CFDI SAT

> Herramienta pública para consultar **un CFDI a la vez** en el servicio ConsultaCFDI del SAT. No pide cuenta ni recibe XML en el servidor; el archivo se lee exclusivamente en el navegador.

> **Repositorio canónico de producto.** Este es el único repositorio destinado a GitHub, Vercel y uso público. El material de fixtures y reglas didácticas permanece separado en [CFDI Fixture Lab](https://github.com/jccontrerasg08-cpu/cfdi-fixture-lab); no se ejecuta ni se despliega junto con esta aplicación.

## Desarrollo

| Comando | Propósito |
|---|---|
| `pnpm dev` | Inicia la aplicación local. |
| `pnpm check` | Comprueba los tipos de TypeScript. |
| `pnpm test` | Ejecuta los contratos del SAT y la lectura local de XML. |
| `pnpm build` | Genera el cliente Vite y el servidor Node. |

La organización del código se explica en [Arquitectura](docs/ARCHITECTURE.md). Para GitHub Actions y Vercel, consulta [Despliegue](docs/DEPLOYMENT.md).

## Repositorio

El repositorio incluye [Contribuir](CONTRIBUTING.md), una licencia [MIT](LICENSE), una política de archivos locales en `.gitignore` y un flujo de validación en `.github/workflows/ci.yml`. El directorio `docs/` concentra la arquitectura y el despliegue para que el código de producto permanezca en `client/`, `server/` y `api/`.

## Uso

Abre la página pública y captura los cinco datos del comprobante, o selecciona un XML CFDI para extraerlos localmente. La aplicación valida los campos primero en el navegador y después en el servidor. Sólo si los datos tienen formato válido, el servidor envía una solicitud SOAP única al SAT.

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

## XML, historial y vista previa

El XML se abre mediante APIs nativas del navegador para leer RFC, total, UUID y los ocho últimos caracteres del sello. El archivo no se transmite ni se almacena. Desde los datos extraídos, la página produce una vista previa HTML semántica que puede imprimirse o guardarse como PDF con el diálogo estándar del navegador.

Después de un Acuse exitoso, la aplicación puede conservar hasta ocho consultas recientes en `localStorage` del navegador actual. Ese historial contiene datos de consulta y respuesta; no incluye el archivo XML y puede eliminarse con un solo control desde la interfaz.

## Errores típicos de CFDI

La interfaz incluye una guía de lectura para los casos más frecuentes: XML que no puede interpretarse, ausencia de `TimbreFiscalDigital` o UUID, RFC/total con formato inválido, falta del atributo `Sello` y fallos temporales de red, HTTP o SOAP. Cada caso diferencia la señal observada de una acción de lectura prudente. Esta guía no certifica la validez fiscal del comprobante ni reemplaza una revisión profesional.

## Límites

La herramienta realiza **una consulta individual por solicitud**. No habilita lotes, monitoreo, cancelación, timbrado, firma ni asesoría fiscal. El Acuse es la respuesta del SAT y no constituye por sí mismo una conclusión fiscal, legal o de cumplimiento.

## Referencia oficial

Consulta el contrato publicado por el SAT en el [WSDL de ConsultaCFDI](https://consultaqr.facturaelectronica.sat.gob.mx/ConsultaCFDIService.svc). La guía oficial del servicio está disponible en [Documentación del Servicio de Consulta de CFDI](https://www.sat.gob.mx/minisitio/Factura/documentos/cancelacion/ar_consulta_cfdi.pdf).
