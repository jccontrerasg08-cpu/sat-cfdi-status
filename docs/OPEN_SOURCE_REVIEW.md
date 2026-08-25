# Revisión integral de proyecto open source

**Última revisión:** 2026-08-25  
**Alcance:** código, dependencias, endpoints, privacidad, experiencia pública, documentación, despliegue y mantenimiento comunitario.

## Metodologías consultadas

| Rol senior | Referencia de GitHub | Resultado aplicado |
|---|---|---|
| Arquitectura | [Architect Reviewer](https://github.com/VoltAgent/awesome-codex-subagents/blob/main/categories/04-quality-security/architect-reviewer.toml) | Se retiró la infraestructura de plantilla sin consumidores y se alinearon los puntos de entrada reales. |
| Seguridad web y XML | [OWASP Web Checklist](https://github.com/0xRadi/OWASP-Web-Checklist) y [XML Security Cheat Sheet](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/XML_Security_Cheat_Sheet.md) | Se conservó el XML sólo en cliente, se aplicó consentimiento para historial local, CSP y cabeceras defensivas. |
| API | [API Security Checklist](https://github.com/shieldfy/API-Security-Checklist) | Se validó el contrato SOAP y se añadió un límite de tasa por instancia. |
| Frontend y rendimiento | [Front-End Checklist](https://github.com/thedaviddias/Front-End-Checklist) y [Performance Checklist](https://github.com/thedaviddias/Front-End-Performance-Checklist) | Se restauró el zoom, se añadió salto al contenido, se difirieron rutas pesadas y se redujeron dependencias de UI. |
| Calidad | [SQA Baseline](https://github.com/indigo-dc/sqa-baseline) | Tipos, pruebas y compilación son comprobaciones obligatorias del repositorio. |
| Open source | [Open Source Guide](https://github.com/github/opensourceguide.com) | Se incorporaron política de seguridad, código de conducta y plantillas de incidencias y PR. |
| Cadena de suministro | [Security Auditing of Open-Source Dependencies](https://github.com/Protik49/Security-Auditing-of-Open-Source-Dependencies) | Se eliminaron dependencias sin uso, se actualizaron dependencias activas y `pnpm audit --prod` no reporta vulnerabilidades. |

## Arquitectura verificada

| Área | Responsabilidad | Datos persistidos |
|---|---|---|
| `client/` | Consulta pública, lectura local de XML, Laboratorio y cotizador educativo. | Sólo historial opcional del navegador, tras consentimiento. |
| `server/` | Validación, límite de tasa por instancia y proxy SOAP al SAT. | Ninguno. |
| `api/` | Adaptador de la aplicación pública para Vercel. | Ninguno. |
| `lab/` y `docs/lab/` | Fixtures, XSD y documentación educativa aislada del flujo operativo. | Ninguno. |

## Hallazgos de alta confianza corregidos

Se corrigieron el fallback de rutas SPA en Vercel, el zoom móvil, el foco por teclado, los mensajes y rutas de error en español, el consentimiento del historial, la carga diferida de rutas educativas, las cabeceras defensivas y el límite de tasa. El repositorio es público, expone la URL canónica de producción y contiene archivos de comunidad para contribuciones externas.

Se retiraron dependencias, archivos y catálogos de interfaz de plantilla sin consumidores. Después de la limpieza, la auditoría de dependencias de producción informa **0 vulnerabilidades**.

## Verificación reproducible

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build
pnpm audit --prod --json
```

La suite actual cubre contratos SOAP —incluidos namespace, total y timeout—, privacidad del XML, XSD, Laboratorio, cotizador y navegación de teclado del editor.

## Límites conocidos

La validación XSD se ejecuta localmente con WebAssembly y se carga sólo en el Laboratorio; su peso no forma parte de la carga inicial de la consulta. El parser acotado del `Acuse` SOAP fue probado para su contrato actual y no procesa XML de entrada de una persona usuaria. El límite de tasa es deliberadamente por instancia serverless; un control distribuido requeriría una decisión explícita de infraestructura.

> La revisión reduce riesgos y mejora verificablemente la calidad, pero no equivale a una garantía absoluta de ausencia de defectos o vulnerabilidades futuras.
