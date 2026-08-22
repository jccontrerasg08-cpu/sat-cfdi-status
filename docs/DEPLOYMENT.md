# Despliegue

## GitHub

El repositorio usa `pnpm` y Node.js 22. La validación automatizada ejecuta `pnpm check`, `pnpm test` y `pnpm build` en cada cambio a `main` y en cada solicitud de incorporación.

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build
```

## Vercel

Vercel compila el cliente Vite en `dist/public` y publica la función `api/[...path].ts` para la API tRPC. La función exporta la instancia Express; no abre puertos ni mantiene procesos persistentes. La ruta pública que consume la interfaz es `/api/trpc`.

No se requieren claves del SAT: ConsultaCFDI es un servicio público. La versión actual tampoco necesita variables de entorno, base de datos, almacenamiento remoto ni autenticación para consultar un CFDI.

| Variable | Estado actual | Motivo |
|---|---|---|
| Variables del SAT | No aplica | El endpoint es público y no usa credenciales. |
| `DATABASE_URL` | No aplica | La consulta no persiste datos. |
| OAuth, JWT o almacenamiento | No aplica | La interfaz y la API son públicas y no incluyen estos flujos. |
| Variables futuras | Opcionales | Sólo deben añadirse si se incorpora una función que las requiera. |

Si en el futuro se habilita autenticación, archivos remotos o una base de datos, sus variables deben añadirse de forma explícita en Vercel y nunca versionarse en `.env`.

> La integración con Vercel se mantiene separada de la publicación administrada de Manus. La configuración externa debe validarse con un despliegue de vista previa antes de promover cambios a producción.

## Estado verificado

La publicación canónica está disponible en [sat-cfdi-status-mx.vercel.app](https://sat-cfdi-status-mx.vercel.app) y el proyecto Vercel `sat-cfdi-status-mx` está conectado al repositorio `jccontrerasg08-cpu/sat-cfdi-status`. La configuración del proyecto no contiene variables de entorno, lo cual coincide con el flujo público actual sin secretos ni persistencia.

El flujo `Validate` de GitHub Actions está correctamente detectado, pero GitHub no inició el runner porque la cuenta reportó pagos recientes fallidos o un límite de gasto que requiere ajuste. Este bloqueo proviene de la cuenta de GitHub, no de la configuración o la compilación del repositorio; la aplicación sigue desplegada en Vercel desde la rama `main`.

| Entorno | Fuente | URL verificada | Estado |
|---|---|---|---|
| Production | `main` | [sat-cfdi-status-mx.vercel.app](https://sat-cfdi-status-mx.vercel.app) | Ready |
| Preview | `preview/vercel-verification` | [sat-cfdi-status-ai2shnmmp-j-4933.vercel.app](https://sat-cfdi-status-ai2shnmmp-j-4933.vercel.app) | Ready |

La rama Preview sólo comprueba el flujo de Vercel con un commit vacío y no altera el comportamiento de Production. Puede eliminarse cuando deje de ser útil.
