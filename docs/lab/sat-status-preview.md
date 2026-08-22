# Consulta de estatus CFDI del SAT

> `--sat-status-preview` comprueba localmente la forma de una expresión. `--sat-status` realiza **una consulta explícita** al servicio público SOAP del SAT. Ningún modo certifica la validez fiscal ni reemplaza una revisión profesional.

## Uso

La previsualización no abre conexiones y nunca muestra los identificadores enviados.

```bash
python3 src/cfdi_fixture_lab.py --sat-status-preview '?re=AAA010101AAA&rr=XAXX010101000&tt=100.00&id=123e4567-e89b-12d3-a456-426614174000&fe=ABC12345'
```

La consulta remota se solicita de forma separada y acepta la misma expresión impresa, que contiene `re`, `rr`, `tt`, `id` y `fe`. El cliente valida que haya un valor por clave, que el UUID sea válido, que el total sea decimal positivo y finito y que `fe` tenga ocho caracteres no vacíos. Si falla esa validación, el proceso no envía ninguna petición.

```bash
python3 src/cfdi_fixture_lab.py --sat-status '?re=<RFC_EMISOR>&rr=<RFC_RECEPTOR>&tt=<TOTAL>&id=<UUID>&fe=<ULTIMOS_8_SELLO>'
```

## Contrato de transporte y salida

El cliente usa el endpoint público `https://consultaqr.facturaelectronica.sat.gob.mx/ConsultaCFDIService.svc`, `POST` y la acción SOAP `http://tempuri.org/IConsultaCFDIService/Consulta`. Envía una sola operación `Consulta` con el parámetro `expresionImpresa`; no requiere token, certificado ni credencial. La respuesta expone únicamente los campos oficiales del `Acuse`, junto con un estado HTTP local.

| Campo | Procedencia | Tratamiento en la salida |
|---|---|---|
| `CodigoEstatus` | Acuse del SAT | Se devuelve sin interpretación. |
| `EsCancelable` | Acuse del SAT | Se devuelve sin interpretación. |
| `Estado` | Acuse del SAT | Se devuelve sin interpretación. |
| `EstatusCancelacion` | Acuse del SAT | Se devuelve sin interpretación. |
| `ValidacionEFOS` | Acuse del SAT | Se devuelve sin interpretación. |
| `transport.http_status` | Transporte local | Registra sólo el código HTTP recibido. |

```json
{
  "sat_status": {
    "profile": "sat_consultacfdi_1_3",
    "network": "sent",
    "transport": {"http_status": 200},
    "acuse": {
      "CodigoEstatus": "S - Comprobante obtenido satisfactoriamente.",
      "EsCancelable": "No cancelable",
      "Estado": "Vigente",
      "EstatusCancelacion": "En proceso",
      "ValidacionEFOS": "200"
    }
  }
}
```

Una entrada localmente inválida devuelve el resultado de previsualización con `network: "not_sent"`. Un fallo de red, HTTP, SOAP o una respuesta de tamaño no esperado devuelve `network: "failed"` y un código de error de transporte; no se vuelven a intentar peticiones ni se conserva el contenido de la respuesta.

## Límites y privacidad

La expresión de consulta contiene datos de una factura. El cliente no la imprime, no la persiste, no escribe registros de aplicación y limita la respuesta HTTP leída a 256 KiB. Las pruebas sustituyen el transporte por una respuesta SOAP sintética y no consultan datos de contribuyentes.

El estado que devuelva el SAT es información oficial de la operación consultada, pero este repositorio no concluye vigencia fiscal, cancelación efectiva, cumplimiento, consecuencias EFOS ni obligaciones de comercio exterior.

## Referencias

[1] [SAT — descripción WSDL pública de ConsultaCFDI](https://consultaqr.facturaelectronica.sat.gob.mx/ConsultaCFDIService.svc)

[2] [SAT — Documentación del Servicio de Consulta de CFDI, versión 1.3](https://www.sat.gob.mx/minisitio/Factura/documentos/cancelacion/ar_consulta_cfdi.pdf)
