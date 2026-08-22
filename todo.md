# Project TODO

- [x] Implementar una página pública sin inicio de sesión con campos para RFC emisor, RFC receptor, total, UUID y ocho caracteres finales del sello.
- [x] Validar en cliente y servidor los datos de la expresión impresa y rechazar entradas inválidas sin contactar al SAT.
- [x] Crear un procedimiento público que construya la solicitud SOAP ConsultaCFDI, aplique un tiempo máximo de espera y no persista ni registre identificadores.
- [x] Extraer y devolver exclusivamente CodigoEstatus, Estado, EsCancelable, EstatusCancelacion y ValidacionEFOS del Acuse oficial.
- [x] Comunicar errores de validación, red, HTTP y SOAP con mensajes claros y sin reflejar datos sensibles.
- [x] Diseñar una interfaz pública elegante, adaptable y accesible, con estados de carga, error y resultado.
- [x] Publicar una explicación clara del endpoint HTTPS, operación Consulta, SOAPAction, expresionImpresa, Acuse y límites de uso.
- [x] Separar visualmente la herramienta operativa de los materiales educativos de fixtures, XSD y pruebas.
- [x] Añadir pruebas Vitest para el contrato de validación, construcción SOAP y lectura del Acuse.
- [x] Parsear SOAP Fault aunque el SAT responda HTTP no exitoso y traducirlo a un mensaje específico sin exponer identificadores.
- [x] Presentar los errores de validación del servidor por campo cuando el navegador no los haya detenido.
- [x] Cubrir con Vitest un HTTP 500 con SOAP Fault y la validación del procedimiento público.
- [x] Añadir una prueba de integración de `satStatus.query` que exponga errores de validación por campo desde el procedimiento tRPC público.
- [x] Verificar la interfaz en escritorio y móvil y ejecutar las pruebas y tipado.
- [ ] Crear un punto de control publicable después de la verificación final exitosa.
