# Contribuir

El objetivo del repositorio es mantener una consulta individual de CFDI sencilla, pública y prudente. No se aceptan cambios que envíen XML al servidor, persistan RFC/UUID por defecto, introduzcan consultas masivas o presenten el Acuse del SAT como una conclusión fiscal.

Antes de abrir una solicitud de incorporación, instala las dependencias con `pnpm install --frozen-lockfile` y ejecuta:

```bash
pnpm check
pnpm test
pnpm build
```

Los cambios de interfaz deben conservar la lectura local del XML, la accesibilidad por teclado y el respeto a `prefers-reduced-motion`. Los cambios de contrato SOAP deben incluir una prueba enfocada en `server/satStatus.test.ts`.
