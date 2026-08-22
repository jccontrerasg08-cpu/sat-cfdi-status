# Arquitectura del repositorio

La aplicación se organiza como un producto público de consulta individual de CFDI. La frontera principal es clara: **el navegador lee el XML localmente; el servidor sólo transmite la expresión requerida a ConsultaCFDI del SAT**.

| Ruta | Responsabilidad | Se versiona |
|---|---|---|
| `client/` | Interfaz React, vista previa, historial local y guía de errores. | Sí |
| `server/app.ts` | Aplicación Express pública y middleware tRPC. | Sí |
| `server/satStatus.ts` | Validación, sobre SOAP y lectura minimizada del Acuse. | Sí |
| `api/[...path].ts` | Adaptador serverless para Vercel. | Sí |
| `server/_core/` | Utilidades de ejecución local conservadas por la plantilla. | Sí; no es parte de la consulta pública. |
| `docs/` | Guías de arquitectura y despliegue. | Sí |
| `drizzle/` | Esquema heredado de plantilla; no participa en la consulta pública. | Sí |
| `.manus*`, `.vercel/`, `dist/`, `node_modules/`, `.env*` | Estado local, artefactos o secretos. | No |

El repositorio [CFDI Fixture Lab](https://github.com/jccontrerasg08-cpu/cfdi-fixture-lab) permanece como referencia educativa de fixtures sintéticos y reglas locales. No forma parte de la compilación, las dependencias, GitHub Actions ni el despliegue Vercel de este producto.

## Flujo público

1. La interfaz valida datos capturados o los extrae de un XML que permanece en memoria del navegador.
2. La mutación `satStatus.query` envía únicamente los cinco datos necesarios al endpoint interno `/api/trpc`.
3. `server/satStatus.ts` genera la operación SOAP `Consulta` y devuelve los campos oficiales del `Acuse`.
4. El historial, si la persona lo habilita al usar la interfaz, se limita a `localStorage` del navegador y no incluye el XML.

El proyecto no usa una base de datos, almacenamiento remoto ni OAuth para el flujo de consulta pública. La configuración Vite se limita a React, Tailwind y el compilador; no incluye telemetría ni instrumentación de alojamiento.
