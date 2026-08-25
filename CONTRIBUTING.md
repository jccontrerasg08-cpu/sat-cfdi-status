# Contribuir

Gracias por mejorar Consulta CFDI SAT. El objetivo del repositorio es mantener una consulta individual de CFDI sencilla, pública y prudente. No se aceptan cambios que envíen XML al servidor, persistan RFC/UUID sin consentimiento explícito, introduzcan consultas masivas o presenten el Acuse del SAT como una conclusión fiscal.

## Antes de empezar

Revisa el [código de conducta](CODE_OF_CONDUCT.md), la [política de seguridad](SECURITY.md) y las guías de `docs/`. Si el cambio afecta el Laboratorio, conserva el procesamiento local y los límites explicados en `docs/LABORATORY.md`.

Instala las dependencias con `pnpm install --frozen-lockfile` y ejecuta:

```bash
pnpm check
pnpm test
pnpm build
```

Los cambios de interfaz deben conservar la lectura local del XML, la accesibilidad por teclado, el zoom móvil y el respeto a `prefers-reduced-motion`. Los cambios de contrato SOAP deben incluir una prueba enfocada en `server/satStatus.test.ts`. Describe el propósito del cambio, sus pruebas y cualquier impacto de privacidad en la solicitud de incorporación.
