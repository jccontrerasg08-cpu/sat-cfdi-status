"""Cotizador aduanero sintético y local; no determina contribuciones oficiales."""

from __future__ import annotations

import argparse
import json
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
from typing import Any

IVA_RATE = Decimal("0.16")
DTA_RATE = Decimal("0.008")
IGI_RATE = Decimal("0")
PRV_FEE = Decimal("290.00")
CENT = Decimal("0.01")


def money(value: Decimal) -> Decimal:
    return value.quantize(CENT, rounding=ROUND_HALF_UP)


def positive_decimal(value: object, label: str) -> Decimal:
    try:
        result = Decimal(str(value))
    except (InvalidOperation, ValueError) as error:
        raise ValueError(f"{label} debe ser un decimal positivo.") from error
    if not result.is_finite() or result <= 0:
        raise ValueError(f"{label} debe ser un decimal positivo.")
    return result


def synthetic_customs_quote(valor_usd: object, tipo_cambio: object) -> dict[str, Any]:
    """Devuelve una cotización educativa con un contrato JSON estable."""
    usd = positive_decimal(valor_usd, "valor_usd")
    exchange_rate = positive_decimal(tipo_cambio, "tipo_cambio")
    customs_value = money(usd * exchange_rate)
    igi = money(customs_value * IGI_RATE)
    dta = money(customs_value * DTA_RATE)
    iva_base = customs_value + igi + dta
    iva = money(iva_base * IVA_RATE)
    total = money(igi + dta + PRV_FEE + iva)

    return {
        "ok": True,
        "scope": "synthetic_local_only",
        "currency": "MXN",
        "customs_value": str(customs_value),
        "exchange_rate": str(exchange_rate),
        "breakdown": {
            "igi": str(igi),
            "dta": str(dta),
            "iva_base": str(iva_base),
            "iva": str(iva),
            "prv": str(PRV_FEE),
        },
        "total_contributions": str(total),
        "note": "Modelo sintético local; no es una determinación fiscal ni aduanera oficial.",
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Cotización aduanera sintética local.")
    parser.add_argument("--valor-usd", required=True)
    parser.add_argument("--tipo-cambio", required=True)
    args = parser.parse_args()
    try:
        print(json.dumps(synthetic_customs_quote(args.valor_usd, args.tipo_cambio), ensure_ascii=False))
    except ValueError as error:
        parser.error(str(error))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
