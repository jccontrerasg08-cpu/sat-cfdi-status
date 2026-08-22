"""Optional local-only evaluation; never calls SAT, PAC, signing, portal, or download APIs."""
from __future__ import annotations

import json
from pathlib import Path

from lxml import etree
from satcfdi.cfdi import CFDI


ROOT = Path(__file__).resolve().parents[1]
FIXTURES = ROOT / "fixtures"
EVALUATION_FIXTURES = Path(__file__).resolve().parent / "fixtures"
CFDI_NS = {"cfdi": "http://www.sat.gob.mx/cfd/4"}


def report() -> dict[str, object]:
    minimal = FIXTURES / "minimal.xml"
    complete = EVALUATION_FIXTURES / "complete-synthetic-cfdi40.xml"
    malformed = FIXTURES / "malformed.xml"

    local_cfdi = CFDI.from_file(complete)
    parsed_xml = etree.parse(str(minimal))
    version = parsed_xml.xpath("string(/cfdi:Comprobante/@Version)", namespaces=CFDI_NS)
    emitted = parsed_xml.xpath("string(/cfdi:Comprobante/@Fecha)", namespaces=CFDI_NS)

    malformed_rejected = False
    try:
        etree.parse(str(malformed))
    except etree.XMLSyntaxError:
        malformed_rejected = True

    if local_cfdi.tag != "{http://www.sat.gob.mx/cfd/4}Comprobante":
        raise AssertionError("satcfdi did not preserve the local CFDI root tag")
    if local_cfdi["Version"] != "4.0":
        raise AssertionError("satcfdi did not expose the local CFDI version")
    if version != "4.0" or not emitted:
        raise AssertionError("lxml XPath did not read expected synthetic CFDI attributes")
    if not malformed_rejected:
        raise AssertionError("lxml accepted the deliberately malformed synthetic fixture")

    return {
        "network_calls": 0,
        "credentials_used": False,
        "synthetic_inputs": [minimal.name, complete.name, malformed.name],
        "satcfdi": {"status": "passed", "root": local_cfdi.tag, "version": local_cfdi["Version"]},
        "lxml": {"status": "passed", "version_xpath": version, "malformed_rejected": malformed_rejected},
    }


if __name__ == "__main__":
    print(json.dumps(report(), ensure_ascii=False, sort_keys=True))
