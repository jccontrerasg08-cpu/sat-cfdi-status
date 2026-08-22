# Revisión de compatibilidad con fixtures públicos

Esta revisión comprueba cómo se comporta CFDI Fixture Lab ante un corpus **pequeño, reproducible y explícitamente sintético** encontrado en GitHub. No incorpora ni redistribuye XML externo. La selección completa se rige por la [política del corpus público](public-corpus-policy.md).

> Este informe no certifica CFDI, no representa todos los ejemplos de GitHub y no evalúa comprobantes reales. Sólo describe una ejecución local contra tres fixtures de prueba elegibles.

## Corpus revisado

| Fuente | Revisión fijada | Licencia publicada | XML elegibles | Motivo de inclusión |
|---|---:|---|---:|---|
| [`SAT-CFDI/python-satcfdi`][1] | `add4f218f070823a735fb66eab3f06091192773d` | MIT | 3 | Los tres archivos se encuentran en `tests/` y se describen explícitamente como valores aleatorios para pruebas. |

Los archivos se procesaron temporalmente desde la revisión fijada. La ejecución no retuvo su contenido, sus certificados, sus firmas ni sus atributos; los clones se eliminan al terminar el estudio.

## Resultado agregado

| Medida | Resultado |
|---|---:|
| Rutas locales procesadas | 3 |
| Árboles XML leídos | 3 |
| `unexpected_root` | 0 |
| `xml_parse_error` | 0 |
| `fecha_inconsistent` | 3 |
| `required_attribute_missing` | 1 |
| Otros códigos | 0 |

Los tres ejemplos usan `Version="4.0"` con una fecha anterior a la ventana educativa del laboratorio, por lo que reciben `fecha_inconsistent`. Un ejemplo mínimo también omite `MetodoPago`, una de las condiciones internas deliberadamente simplificadas, y recibe `required_attribute_missing`.

Estos resultados son **observaciones del laboratorio**, no hallazgos fiscales. En particular, no justifican ampliar la lista de atributos, añadir esquemas oficiales, modificar XML ni asumir que un fixture de terceros debe pasar sin advertencias.

## Exclusiones deliberadas

La búsqueda pública encontró múltiples repositorios y rutas XML, pero el criterio de seguridad fue más importante que el volumen.

| Fuente excluida | Decisión | Razón documentada |
|---|---|---|
| [`eclipxe13/CfdiUtils`][2] | Excluir | Sus assets de prueba incluyen documentos rotulados como reales y datos que el proyecto no admite retener. |
| [`bigdata-mx/factura-electronica`][3] | Excluir | Sus XML están en recursos generales, no en un corpus de pruebas aislado; el proyecto tampoco tiene actividad reciente. |
| [`facturacionmoderna/Comprobantes`][4] | Excluir | No publica una licencia detectable y reúne ejemplos para giros de negocio. |
| [`MisaelMa/node-cfdi`][5] | Excluir | Los candidatos identificados no se autodescriben como datos sintéticos. |

Esta decisión evita que el repositorio convierta ejemplos publicados en una base de comprobantes. Un candidato excluido no se vuelve elegible por ser público.

## Funcionalidad añadida a partir de la revisión

La compatibilidad se evaluó con la nueva opción local `--summary`:

```bash
python3 src/cfdi_fixture_lab.py --summary fixtures/*.xml
```

La CLI sigue imprimiendo una línea JSON por ruta y agrega un objeto final con `files`, `issues` y el recuento por `codes`. El resumen sirve para revisar un lote local sin imprimir ni almacenar contenido XML adicional. Su contrato aparece en [Salida JSON Lines](output.md#resumen-agregado-opcional).

No se añadió una regla fiscal nueva: el tamaño del corpus no sostiene una generalización. La mejora correcta fue hacer observable el comportamiento por lote y protegerlo con una prueba enfocada.

## Referencias

[1]: https://github.com/SAT-CFDI/python-satcfdi/tree/add4f218f070823a735fb66eab3f06091192773d "SAT-CFDI/python-satcfdi, revisión evaluada"
[2]: https://github.com/eclipxe13/CfdiUtils "eclipxe13/CfdiUtils"
[3]: https://github.com/bigdata-mx/factura-electronica "bigdata-mx/factura-electronica"
[4]: https://github.com/facturacionmoderna/Comprobantes "facturacionmoderna/Comprobantes"
[5]: https://github.com/MisaelMa/node-cfdi "MisaelMa/node-cfdi"

[Inicio](../README.md) · [Política del corpus](public-corpus-policy.md) · [Salida](output.md) · [Reglas](rules.md) · [Contribuir](../CONTRIBUTING.md)
