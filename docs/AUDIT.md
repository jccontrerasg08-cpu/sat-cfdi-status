# Auditoría de calidad y seguridad

La aplicación se revisó tras la publicación del commit `1d3c4f9` en Vercel. La comprobación se concentra en comportamientos verificables del producto público y no sustituye una prueba de penetración independiente.

## Cobertura verificada

| Área | Evidencia | Resultado |
| --- | --- | --- |
| Pantallas | Revisión de escritorio, tableta, móvil y móvil de baja altura | El formulario, el Laboratorio y el editor conservan legibilidad; el editor reduce su altura en pantallas bajas. |
| Accesibilidad | Foco visible, etiquetas vinculadas, contraste y anuncios de estado | Los controles críticos exponen un foco perceptible y los resultados de consulta usan anuncios accesibles. |
| Privacidad | Inspección de carga XML e historial | El XML se procesa en el navegador. El historial se guarda sólo en `localStorage` y se puede borrar desde la interfaz. |
| Rendimiento | Revisión de rutas | El Laboratorio y el cotizador se cargan bajo demanda; el cotizador no importa los esquemas XSD. |
| Producción | `https://sat-cfdi-status-mx.vercel.app/` sin sesión de Vercel | La aplicación responde públicamente con HTTP 200. |

## Cabeceras verificadas

La URL de producción entrega `Content-Security-Policy`, `Permissions-Policy`, `Referrer-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options` y `X-Frame-Options`.

La política permite únicamente el origen propio y el endpoint público de ConsultaCFDI del SAT para conexiones. También conserva `wasm-unsafe-eval`, necesario para la validación XSD local ejecutada mediante WebAssembly.

## Límites conocidos

El Laboratorio se carga bajo demanda para no aumentar la primera carga de la consulta operativa. Su bloque incluye el validador XSD WebAssembly y los esquemas CFDI, por lo que en la compilación verificada representa aproximadamente 450 kB comprimidos al abrir esa ruta por primera vez. En conexiones móviles lentas, esa espera es esperable sólo al entrar al Laboratorio; la consulta operativa no descarga ese bloque.

La auditoría confirma los controles descritos, pero no garantiza ausencia absoluta de vulnerabilidades. Antes de tratar la aplicación como un sistema de alto riesgo, conviene realizar una prueba de penetración independiente, revisar dependencias de forma periódica y monitorizar los cambios del contrato público del SAT.
