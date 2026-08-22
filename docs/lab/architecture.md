# Arquitectura y límites

CFDI Fixture Lab es una herramienta de lectura local compuesta por una CLI, treinta y un fixtures didácticos, un corpus XSD estructural separado y una suite de pruebas enfocadas. Su arquitectura favorece una explicación corta y verificable antes que cobertura fiscal amplia.

<p align="center">
  <img src="assets/validation-flow.png" alt="Arquitectura del flujo local de CFDI Fixture Lab" width="920" />
</p>

## Componentes

| Componente | Ruta | Responsabilidad | No hace |
|---|---|---|---|
| CLI | `src/cfdi_fixture_lab.py:main` | Procesa rutas locales y expone una consulta SAT individual sólo mediante `--sat-status`. | No modifica archivos, no envía XML ni inicia consultas implícitas. |
| Lectura XML | `validate_file` | Abre XML con `ElementTree` y transforma errores locales en `xml_parse_error`. | No recupera, repara ni normaliza XML. |
| Motor de reglas | `validate` | Despacha `Comprobante`, catálogo, balanza, diario y envío sintéticos; revisa estructura y aritmética local. | No aplica catálogos completos, firma ni reglas oficiales. |
| Perfil XSD | `cfdi_schema_validation.py` | Compila el bundle CFDI 4.0 local después de verificar sus hashes y valida estructura sin red. | No verifica sellos, catálogos, condiciones de negocio, PAC ni aceptación SAT. |
| Consulta de estado | `cfdi_sat_status.py` | Valida localmente una expresión y, con `--sat-status`, envía una operación SOAP ConsultaCFDI. | No guarda identificadores, no envía XML, no reintenta ni interpreta el acuse. |
| Resultado | `Issue` | Conserva `code`, `rule`, `message` y `fragment`. | No decide validez fiscal. |
| Fixtures | `fixtures/*.xml` | Enseñan un comportamiento por archivo. | No representan personas, empresas u operaciones. |
| Pruebas | `tests/test_validator.py` | Fijan el contrato observable por fixture. | No dependen de red ni paquetes externos. |

## Recorrido de un archivo

```text
ruta local
   ↓
modo de reglas: ElementTree.parse(path)
   ├── falla de lectura o XML malformado → xml_parse_error
   └── raíz XML
          ↓
      validate(root)
          ├── Comprobante: atributos, fecha y complementos
          ├── FixtureLedgerCatalog: identidad de cuenta
          ├── FixtureTrialBalance: identidad de saldo
          ├── FixtureJournal: líneas y equilibrio local
          └── FixtureTradeShipment: campos y total local
                  ↓
          list[Issue]
                  ↓
JSON Lines: {"file": "...", "issues": [...]}

modo XSD: ruta local
   ↓
lxml + bundle CFDI 4.0 con hashes verificados y red deshabilitada
   ↓
JSON Lines: {"file": "...", "schema": {"valid": true|false, ...}}
```

Cada paso depende sólo del anterior. Por ejemplo, un XML que no se puede parsear no llega a reglas de atributos o fecha. Esta secuencia evita mensajes secundarios que no se pueden fundamentar sobre un documento ilegible.

## Decisiones de diseño

| Decisión | Motivo | Consecuencia visible |
|---|---|---|
| Dependencia XSD explícita | XSD no existe en la biblioteca estándar; `lxml` se fija sólo para el perfil estructural. | Requiere `pip install -r requirements.txt`; las reglas didácticas conservan `ElementTree`. |
| XML estricto | El laboratorio debe mostrar errores de entrada, no ocultarlos. | Un XML malformado produce `xml_parse_error`. |
| Salida JSON Lines | La CLI puede procesar varias rutas y seguir siendo legible para personas o scripts. | Una línea estable por fixture. |
| Códigos estables | Un mensaje puede mejorar; un código permite pruebas y automatización. | Tests comparan `uuid_missing`, no textos enteros. |
| Fragmentos pequeños | El aprendizaje debe apuntar a la pieza relevante sin exponer un documento completo. | `fragment` contiene un atributo o nodo representativo. |
| Fixtures por escenario | Un archivo con un propósito reduce ambigüedad pedagógica. | Treinta y un XML cubren CFDI, parseo, raíz, espacio de nombres, contabilidad y envío sintético. |

## Frontera de seguridad y alcance

<p align="center">
  <img src="assets/scope-boundary.png" alt="Límite entre el laboratorio local y acciones fiscales o de red explícitamente excluidas" width="920" />
</p>

| Dentro de la frontera | Fuera de la frontera |
|---|---|
| Lectura de XML ficticio desde disco local | Archivos CFDI reales o información de terceros fuera de una expresión iniciada explícitamente |
| Perfil XSD local con artefactos fijados | Recuperación de esquemas en tiempo de ejecución |
| Previsualización local y una consulta SOAP ConsultaCFDI solicitada explícitamente | PAC, VUCEM, otros servicios remotos, consultas masivas o monitoreo |
| Validaciones educativas explícitas | Validación oficial, certificación o asesoría fiscal |
| Campos oficiales del acuse y pruebas offline con transporte simulado | Firma, sellos, e.firma, certificados y timbrado |
| Diagramas y documentación de reglas | Conexión remota distinta del punto final público ConsultaCFDI |
| Aritmética de fixtures ficticios | DIOT, contabilidad electrónica, IVA o reportes oficiales |
| Envío ficticio y suma local | LIGIE, aranceles, tratados, pedimentos, RRNA, permisos o despacho |
| Revisión de fixtures sin modificación | Limpieza, corrección, normalización o reescritura XML |

> [!WARNING]
> Que un fixture no produzca `issues` significa solamente que no activó las reglas implementadas en este repositorio. **No significa que sea válido para uso fiscal.**

## Cómo crecer sin perder el objetivo

Una ampliación se justifica sólo si describe un caso concreto y verificable. El cambio mínimo es: un contrato documentado, una entrada sintética o una prueba de transporte simulada, y una prueba enfocada. Antes de añadir un motor de plugins, catálogos o dependencias adicionales, documenta el caso que no puede resolverse con el módulo actual.

El análisis de referencias externas en [`DETAILED_ADOPTION_MATRIX.md`](../DETAILED_ADOPTION_MATRIX.md) conserva decisiones previas sobre librerías, tests y límites. Las lecciones de contabilidad se mantienen como aritmética sintética, sin importar APIs, credenciales ni librerías ajenas al contrato local.

[Inicio](../README.md) · [Centro de documentación](README.md) · [Contabilidad sintética](synthetic-accounting.md) · [Comercio exterior sintético](synthetic-foreign-trade.md) · [Reglas](rules.md) · [Fixtures](fixtures.md) · [Salida](output.md) · [Contribuir](../CONTRIBUTING.md)
