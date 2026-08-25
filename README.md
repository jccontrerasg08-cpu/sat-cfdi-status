# Consulta CFDI SAT

> Consulta pública e individual del estatus de un CFDI ante el SAT, con un Laboratorio XML local para aprendizaje y validación estructural. La aplicación no requiere cuenta y no recibe archivos XML en el servidor.

[Abrir la aplicación](https://sat-cfdi-status-mx.vercel.app) · [Documentación](docs/README.md) · [Contribuir](CONTRIBUTING.md) · [Seguridad](SECURITY.md) · [Código de conducta](CODE_OF_CONDUCT.md) · [MIT](LICENSE)

## Qué resuelve

| Superficie | Uso | Privacidad y alcance |
| --- | --- | --- |
| **Consulta SAT** | Consulta un CFDI con RFC emisor, RFC receptor, total, UUID y los últimos ocho caracteres del sello. | Envía una única expresión impresa al servicio público del SAT; no persiste identificadores. |
| **Lectura local de XML** | Extrae los datos necesarios desde un XML CFDI en el navegador. | El archivo no se transmite ni se guarda. |
| **Laboratorio XML** | Edita, normaliza y valida fixtures y XML con reglas didácticas y el perfil XSD CFDI 4.0. | Es educativo: no certifica sellos, PAC, catálogos ni cumplimiento fiscal. |
| **Resultados locales** | Exporta validaciones del Laboratorio en CSV o mediante el diálogo de impresión para PDF. | El historial es opcional, queda en el navegador y nunca conserva el XML. |

## Inicio rápido

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Abre la URL local indicada por el servidor. Antes de enviar un cambio, ejecuta:

```bash
pnpm check
pnpm test
pnpm build
```

## Uso de ConsultaCFDI

La aplicación construye la expresión `?re=...&rr=...&tt=...&id=...&fe=...` y la entrega como `expresionImpresa` en la operación SOAP `Consulta`.[1]

| Dato | Clave | Formato esperado |
| --- | --- | --- |
| RFC emisor | `re` | RFC de 12 o 13 caracteres. |
| RFC receptor | `rr` | RFC de 12 o 13 caracteres. |
| Total | `tt` | Decimal positivo sin separador de miles. |
| UUID | `id` | Folio fiscal UUID completo. |
| Últimos ocho caracteres del sello | `fe` | Ocho caracteres sin espacios. |

El Acuse se muestra sin reinterpretación: `CodigoEstatus`, `Estado`, `EsCancelable`, `EstatusCancelacion` y `ValidacionEFOS`. Una respuesta del SAT no sustituye una conclusión fiscal, legal o de cumplimiento.

## Arquitectura y documentación

El producto público vive en `client/`, `server/` y `api/`. Los assets educativos, XSD y fixtures residen en `lab/` y `docs/lab/`, separados de la consulta operativa. El índice completo está en [docs/README.md](docs/README.md).

| Documento | Para qué sirve |
| --- | --- |
| [Arquitectura](docs/ARCHITECTURE.md) | Componentes, límites de datos y rutas de ejecución. |
| [Laboratorio](docs/LABORATORY.md) | Reglas, fixtures, XSD, editor XML y alcance educativo. |
| [Despliegue](docs/DEPLOYMENT.md) | GitHub, Vercel, variables y rutas de validación. |
| [Auditoría](docs/AUDIT.md) | Controles de seguridad, accesibilidad y límites de la revisión. |
| [Revisión open source](docs/OPEN_SOURCE_REVIEW.md) | Decisiones de calidad y mantenimiento del repositorio. |

## Límites intencionales

La herramienta realiza una consulta por solicitud. No procesa lotes, no timbra, no firma, no cancela comprobantes, no monitorea de forma continua y no ofrece asesoría fiscal. El Laboratorio usa contenido demostrativo o sintético y no reemplaza la validación oficial.

## Comunidad y reportes

Las propuestas de cambio siguen [CONTRIBUTING.md](CONTRIBUTING.md). Los reportes de seguridad deben seguir el canal de [SECURITY.md](SECURITY.md); no abras datos sensibles en issues públicos.

## Referencias

[1] [SAT — WSDL público de ConsultaCFDI](https://consultaqr.facturaelectronica.sat.gob.mx/ConsultaCFDIService.svc)
