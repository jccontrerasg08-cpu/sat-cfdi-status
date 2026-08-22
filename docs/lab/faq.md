# Preguntas frecuentes

## ¿Qué es CFDI Fixture Lab?

Es un laboratorio local para aprender con XML sintético y reglas pequeñas. Recibe rutas a fixtures ficticios, aplica comprobaciones educativas y devuelve una línea JSON por ruta. No es un servicio de consulta fiscal ni un validador oficial.

## ¿Qué necesito proporcionar?

Para reglas educativas, sólo la ruta local de uno o más XML incluidos en `fixtures/` o de nuevos fixtures igualmente ficticios. Para `--sat-status`, proporciona una expresión impresa compuesta por los datos de una factura que tengas derecho a consultar.

```bash
python3 src/cfdi_fixture_lab.py fixtures/minimal.xml fixtures/uuid-missing.xml
```

No proporciones certificados, contraseñas, e.firma ni XML de terceros. Los UUID, RFC e importes reales no son necesarios para los fixtures; sólo se usan en una expresión de `--sat-status` bajo una consulta explícita, sin que el cliente los imprima o guarde.

## ¿Qué devuelve?

Por cada ruta, la CLI escribe un objeto JSON con `file` e `issues`. Cada `Issue` contiene un código estable, el nombre de la regla educativa, una explicación y un fragmento pequeño. Consulta el [contrato de salida](output.md) para la forma exacta.

## ¿Cómo encuentro las raíces y filtro una demostración?

Usa `python3 src/cfdi_fixture_lab.py --roots` para imprimir las cinco raíces didácticas, namespaces y lecciones sin abrir XML. Para reducir los issues que se muestran sin perder la línea de cada archivo, repite `--filter CODE`; por ejemplo, `python3 src/cfdi_fixture_lab.py --filter uuid_missing fixtures/*.xml`. El [contrato de salida](output.md) define los modos exclusivos y explica que el resumen cuenta sólo los issues emitidos tras el filtro.

## ¿Mis archivos se envían a algún servicio?

Los XML de fixtures no se envían. El módulo usa `xml.etree.ElementTree` para rutas locales y no incluye almacenamiento remoto ni integración PAC. La única excepción es `--sat-status`: construye una petición SOAP pública al SAT a partir de una expresión impresa y no transmite XML, no guarda identificadores y no se ejecuta sin que indiques ese modo.

## ¿Puedo verificar si una factura está vigente o cancelada?

Sí, mediante `--sat-status` y sólo para una expresión solicitada de forma explícita. El comando transmite una operación SOAP individual al SAT y devuelve sin interpretación los campos del acuse, incluidos `Estado`, `EstatusCancelacion` y `ValidacionEFOS`. No certifica cumplimiento, no determina consecuencias fiscales, no consulta PAC, no realiza búsquedas masivas ni guarda datos. Consulta [Consulta de estatus CFDI del SAT](sat-status-preview.md) para el contrato y las precauciones.

## ¿La ausencia de `issues` significa que el XML cumple con CFDI?

No. Sólo significa que las reglas educativas de esta versión no se activaron. El laboratorio no aplica una validación oficial completa, catálogos, firmas ni reglas condicionales. `--sat-status` es una consulta separada de estado y su acuse tampoco convierte un fixture sin issues en un comprobante fiscalmente válido.

## ¿El laboratorio corrige XML?

No. Reportar sin reescribir el archivo es una garantía de diseño. Un campo omitido, una fecha de ejemplo inconsistente o un complemento no soportado se describe mediante un `Issue`; el archivo de entrada no se modifica.

## ¿Por qué no hay una dependencia XML más completa?

La biblioteca estándar cubre las reglas educativas de los treinta y un fixtures, incluida la aritmética sintética con `Decimal`. El perfil estructural CFDI 4.0 es una excepción explícita y versionada: usa `lxml` porque XSD no existe en la biblioteca estándar. Añadir otro paquete o motor de reparación sin un caso concreto haría el proyecto más difícil de instalar y entender. La [matriz de adopción](../DETAILED_ADOPTION_MATRIX.md) y la [guía de validación estructural](cfdi40-structural-validation.md) documentan estas decisiones.

## ¿El laboratorio implementa contabilidad electrónica o DIOT?

No. Las raíces `FixtureLedgerCatalog`, `FixtureTrialBalance` y `FixtureJournal` sólo enseñan identidad, `Decimal` y ecuaciones aritméticas con datos ficticios. No generan DIOT, pólizas oficiales, declaraciones, XSD, XML de envío, ZIP/PDF/XLSX, impuestos, certificados o sellos. Consulta [Contabilidad sintética](synthetic-accounting.md).

## ¿El laboratorio calcula aranceles, tratados o pedimentos?

No. `FixtureTradeShipment` sólo revisa campos ficticios y la suma `Σ(quantity × unit_value)` dentro de un XML local. No busca LIGIE/NICO, no clasifica mercancías, no determina origen, no consulta tratados, no calcula contribuciones, no verifica RRNA, no tramita permisos ni genera pedimentos. Consulta [Comercio exterior sintético](synthetic-foreign-trade.md).

## ¿Cómo propongo un escenario o regla?

Empieza por una pregunta de aprendizaje que se pueda demostrar de forma local. Después crea un XML ficticio mínimo, una prueba enfocada y una entrada en la guía. [`CONTRIBUTING.md`](../CONTRIBUTING.md) contiene el flujo y los límites.

## ¿Qué puedo usar como fuente de reglas fiscales reales?

Este repositorio no prescribe fuentes de cumplimiento. Para cualquier decisión de emisión, recepción, impuestos o cumplimiento, consulta las fuentes oficiales aplicables y asesores cualificados. Las reglas de este laboratorio deben mantener el rótulo **educativo** aunque se inspiren en una estructura XML conocida.

## Referencias

[1]: https://sdv.com.mx/herramientas/verificador-cfdi/ "Verificador de CFDI Gratis — SDV Asesores"

[Inicio](../README.md) · [Centro de documentación](README.md) · [Contabilidad sintética](synthetic-accounting.md) · [Comercio exterior sintético](synthetic-foreign-trade.md) · [Validación estructural](cfdi40-structural-validation.md) · [Arquitectura](architecture.md) · [Reglas](rules.md) · [Fixtures](fixtures.md) · [Salida](output.md) · [Contribuir](../CONTRIBUTING.md)
