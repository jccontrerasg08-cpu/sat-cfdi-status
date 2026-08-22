# Offline CFDI 4.0 structural validation

> **Scope:** this module validates XML structure against the version-pinned CFDI 4.0 XSD bundle stored in this repository. It is not a SAT validation, a fiscal acceptance result, a signature check, a catalog check, or PAC certification.

## Run it

```bash
pip install -r requirements.txt
python3 src/cfdi_fixture_lab.py --xsd-cfdi40 fixtures/xsd/cfdi40-xsd-valid.xml
```

The command emits one JSON line per path:

```json
{
  "file": "fixtures/xsd/cfdi40-xsd-valid.xml",
  "schema": {"profile": "cfdi_4_0_xsd", "valid": true, "errors": []}
}
```

`valid: true` means only that the document conforms to the **bundled XSD profile**. The result must never be presented as “officially valid,” “certified,” or “accepted by SAT.”

## Bundle policy

The profile includes the official CFDI 4.0 XSD and its two direct schema dependencies. The bundle is copied into `schemas/cfdi40/` and remote `schemaLocation` references are rewritten to the local filenames. This lets `lxml` compile the schema with `no_network=True`.

`manifest.json` records the source hash for the original CFDI schema, the hashes of every bundled local file, the retrieval date, and the local import rewrite. The validator hashes every bundled file before compiling the profile; a mismatch stops validation rather than silently using changed artifacts.

## What this profile checks

The XSD engine checks namespace-aware XML grammar, required elements and attributes, datatype and pattern constraints, and fixed values expressed by the pinned schema files. The two checked-in fixtures prove the version-fixed `Comprobante@Version="4.0"` path.

## What this profile does not check

The profile does not verify digital seals, certificates, PAC stamps, SAT catalogs, business conditions, totals beyond XSD constraints, tax calculations, fiscal status, cancellation, or a document’s real-world authenticity. Those capabilities require distinct sources, data, security, and operational contracts.

## Safe evolution

1. Download official artifacts into a temporary review location.
2. Record source URLs, dates, original hashes, and any local-only import rewrites.
3. Add a synthetic pass fixture and a synthetic fail fixture for the intended change.
4. Run the full test suite and review the output wording.
5. Release the bundle update as a versioned change; never update it at runtime.

## References

[1] [SAT — CFDI technical materials and guides](https://www.sat.gob.mx/minisitio/Factura/emite_materialdeayudaparafactura.htm)

[2] [Official CFDI 4.0 XSD source](http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd)
