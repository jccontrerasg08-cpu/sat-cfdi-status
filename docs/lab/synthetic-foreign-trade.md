# Comercio exterior sintético local

Esta guía incorpora una sola raíz ficticia: `FixtureTradeShipment`. Sirve para enseñar despacho XML por namespace, campos estructurales, aritmética `Decimal` y resultados explicables. **No representa una operación de importación, exportación, pedimento, clasificación arancelaria ni cumplimiento aduanero.**

> La página pública de referencia organiza herramientas reales alrededor de clasificación, costos, tratados, pedimentos, origen y regulaciones [1]. CFDI Fixture Lab usa esa secuencia únicamente como inspiración de experiencia: no adopta sus datos, cálculos ni decisiones.

![Flujo de envío sintético](assets/foreign-trade-flow.png)

## Forma local

```xml
<trade:FixtureTradeShipment
    xmlns:trade="https://example.invalid/fixture-trade"
    declared_total="35.00">
  <trade:Line
      product_id="fixture-product-001"
      origin="Origin-X"
      destination="Destination-Y"
      quantity="2"
      unit_value="10.00" />
</trade:FixtureTradeShipment>
```

La raíz y cada `Line` deben pertenecer al namespace exacto `https://example.invalid/fixture-trade`. El namespace no resuelve a un esquema, API o servicio. Una raíz con el mismo nombre en otro namespace se considera `unexpected_root`.

| Campo | Regla local | No significa |
|---|---|---|
| `product_id` | Debe estar presente en cada línea. | Fracción arancelaria, SKU comercial o clasificación LIGIE. |
| `origin` | Debe estar presente en cada línea. | País de origen, elegibilidad TLC o certificado de origen. |
| `destination` | Debe estar presente en cada línea. | Aduana, régimen, destino legal o ruta de transporte. |
| `quantity` | Decimal finito mayor que cero. | Unidad oficial, peso, volumen o cantidad declarable. |
| `unit_value` | Decimal finito no negativo. | Valor en aduana, CIF, moneda, precio comercial o base fiscal. |
| `declared_total` | Decimal finito no negativo igual a la suma local. | Total de pedimento, contribuciones o valor oficial. |

## Única identidad aritmética

> `declared_total = Σ(quantity × unit_value)`

La implementación usa `Decimal` y sólo compara valores escritos en el fixture. No calcula arancel, IGI, DTA, IVA, IEPS, prevalidación, flete, seguros, tratados o cuotas.

## Escenarios incluidos

| Fixture | Lección | Resultado |
|---|---|---|
| [`trade-shipment-valid.xml`](../fixtures/trade-shipment-valid.xml) | Dos líneas locales suman el total declarado. | Sin `issues`. |
| [`trade-shipment-line-missing-field.xml`](../fixtures/trade-shipment-line-missing-field.xml) | Una identidad de línea incompleta se explica sin inferir datos. | `trade_line_missing_field`. |
| [`trade-shipment-invalid-amount.xml`](../fixtures/trade-shipment-invalid-amount.xml) | `quantity` debe ser positiva y decimal finita. | `trade_line_amount_invalid`. |
| [`trade-shipment-invalid-total.xml`](../fixtures/trade-shipment-invalid-total.xml) | El total declarado debe ser decimal finito no negativo. | `trade_declared_total_invalid`. |
| [`trade-shipment-total-inconsistent.xml`](../fixtures/trade-shipment-total-inconsistent.xml) | El total declarado debe coincidir con la suma transparente. | `trade_declared_total_inconsistent`. |
| [`trade-shipment-empty.xml`](../fixtures/trade-shipment-empty.xml) | Un envío requiere al menos una línea. | `trade_shipment_missing_line`. |
| [`foreign-trade-root.xml`](../fixtures/foreign-trade-root.xml) | Un namespace ajeno no activa el parser local. | `unexpected_root`. |

## Matriz de capacidad

| Patrón de comercio exterior | Lección local implementada | Exclusión estricta |
|---|---|---|
| Identificar un producto | Campo ficticio `product_id` presente. | Búsqueda LIGIE, fracciones, NICO y clasificación arancelaria. |
| Conocer origen/destino | Dos campos ficticios legibles. | Países, tratados, reglas de origen y preferencias. |
| Revisar importes | Suma de `quantity × unit_value`. | CIF, arancel, IGI, DTA, IVA, IEPS, seguros, flete y tipo de cambio. |
| Preparar operación | Líneas locales completas y namespace exacto. | Pedimento, despacho, agente aduanal, padrón o trámites. |
| Regulaciones | Ninguna decisión automatizada. | RRNA, NOM, permisos, COFEPRIS, SENASICA y certificaciones. |
| Fuentes de datos | Ninguna; sólo fixtures versionados. | SAT, ANAM, VUCEM, Secretaría de Economía, APIs o dashboards. |

## Demostración de entrevista

```bash
python3 src/cfdi_fixture_lab.py \
  fixtures/trade-shipment-valid.xml \
  fixtures/trade-shipment-total-inconsistent.xml \
  --summary
```

Para recorrer los 31 fixtures de toda la herramienta, incluidos CFDI, contabilidad y comercio exterior sintético, usa `python3 src/cfdi_fixture_lab.py --demo`. El [guion de entrevista](interview-demo.md) muestra cómo explicar esta extensión sin hacer afirmaciones regulatorias.

## Referencias

[1]: https://sdv.com.mx/comercio-exterior/ "Comercio Exterior México 2026 — SDV"

[Inicio](../README.md) · [Centro de documentación](README.md) · [Guion de entrevista](interview-demo.md) · [Reglas](rules.md) · [Fixtures](fixtures.md) · [Salida](output.md)
