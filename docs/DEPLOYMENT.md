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
