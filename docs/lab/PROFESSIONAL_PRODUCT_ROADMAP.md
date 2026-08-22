# CFDI Fixture Lab — Professional Product Roadmap

> **Purpose:** turn the current local teaching laboratory into an original, professional CFDI-oriented product without making false official, certification, legal, tax, payroll, accounting, or customs claims.

## Product statement

**Proposed product:** an original **CFDI Engineering Toolkit** for structurally inspecting XML, managing deterministic test fixtures, producing explainable local findings, and optionally relaying a clearly identified public status response.

It is not a PAC, a SAT-authorized service, accounting software, payroll engine, employer filing system, customs broker system, or legal/tax advisory service. Those are separate product categories with independent operational, authorization, data-protection, and maintenance obligations.

## Product truth table

| Capability | Can we build an original tool? | What it may honestly claim | What it cannot claim without more authorization or evidence |
|---|---|---|---|
| XML well-formedness and selected structural checks | Yes, immediately. | “Local XML structural checks” and “implemented-rule findings.” | “SAT-valid,” “fiscally valid,” or “officially accepted.” |
| Official XSD conformance | Yes, as a versioned offline validator. | “Conforms to the pinned XSD files used by this release.” | Complete semantic, catalog, business-rule, signature, or certification validation. |
| Public CFDI status lookup | Yes, as an explicit, consented integration. | “Official SAT service response, returned at [timestamp].” | Certification, legal advice, continuous monitoring, or a substitute for the SAT portal. |
| Timbrado and cancellation | Only through the applicable official/PAC path. | “Uses an authorized provider integration,” if one is contracted and documented. | Operating as a PAC or using the PAC label. |
| Payroll/retentions | A future, versioned calculation or review tool is possible. | “Implements the listed period-specific rules and assumptions.” | Correct payroll, employer obligations, tax advice, or IMSS filing without reviewed tables, data controls, and a maintained rules program. |
| Electronic accounting | A future offline XSD checker is possible. | “Checks the listed versioned XML structure.” | Filing, submission, taxpayer-account management, or regulatory compliance. |
| Comercio Exterior | A future complement-structure checker is possible. | “Checks the listed versioned complement structure.” | Classification, LIGIE/NICO decisions, permits, customs valuation, pedimentos, or customs representation. |

The SAT describes a certification-provider authorization process and continuing provider obligations; it is therefore incorrect to market a standalone toolkit as a certification service or PAC without that authorization. [1] The public ConsultaCFDI specification describes a SOAP operation that accepts an `expresionImpresa` and returns an `Acuse`, which makes a narrow status-response client technically distinct from certification. [2]

## Data and authorization model

| Data category | Examples | Product treatment required before feature launch |
|---|---|---|
| Public technical material | XSD files, public WSDL, official guide URLs. | Pin version and source; publish update and deprecation policy. |
| Potentially sensitive identifiers | RFC, UUID, printed expression, employer/worker fields. | Explicit purpose, minimized logging, retention policy, and access controls. |
| Highly sensitive fiscal or payroll records | Full CFDI, names, payroll amounts, CURP, employee data. | Secure backend, encryption, deletion controls, privacy notice, access review, and incident process. |
| Signing secrets | CSD, private keys, passwords, e.firma material. | Do not accept or store in the first product milestone. Use a vetted provider integration only after a separate security design. |

## Target architecture

```text
Static portfolio website
  └─ explains capabilities, sources, boundaries, and versions

Original CLI / validation library
  ├─ input adapter (local XML or one explicit ConsultaCFDI expression)
  ├─ XML parser and secure parsing policy
  ├─ versioned structural validators
  ├─ deterministic rule engine
  ├─ JSON Lines / JSON report output
  └─ fixtures, contract tests, and catalog

Optional service boundary — later milestone
  ├─ authenticated API
  ├─ consent and request minimization
  ├─ secure XML storage or no-storage mode
  ├─ authenticated workflows beyond the public status client
  └─ auditable integration logs
```

The current static website is not the runtime for sensitive operations. The current CLI can perform one explicit public status lookup without storage; uploaded XML, payroll records, credential-bearing workflows, persistent logging, or any authenticated status service require a separate backend and data-governance design.

## Staged roadmap

| Stage | Deliverable | Dependencies | Acceptance evidence | Explicit non-goals |
|---|---|---|---|---|
| **0. Foundation** | Current local lab, catalog, fixtures, tests, documentation, and portfolio. | Python standard library. | Existing CLI, tests, GitHub Actions. | Certification and real CFDI fixtures. |
| **1. Offline CFDI structure validator** | Original, version-pinned CFDI 4.0 XSD validation command with a separate structural report. | XSD source policy; one XML-schema library or trusted validation runtime; version test corpus. | Valid/invalid synthetic XSD fixtures, pinned schema hash, regression tests, clear “structure only” result. | Timbrado, catalogs, signatures, payroll calculations. |
| **2. Public status connector — implemented** | Opt-in ConsultaCFDI CLI client returning the official `Acuse` fields unchanged plus local transport metadata. | Python standard-library HTTP transport; public WSDL; privacy documentation; mock SOAP tests; bounded error policy. | No live taxpayer data in tests; simulated SOAP response; request/response contract. | Certification, legal conclusion, bulk scraping, monitoring, data persistence. |
| **3. Professional fixture/QA workspace** | Versioned rule manifests, test reports, schema/version registry, and CI matrix. | Repository convention; report model; optional database only if history is needed. | Rule → fixture → test → report traceability. | Multi-tenant customer platform. |
| **4. Specialized modules** | Pick exactly one: payroll structure review, electronic-accounting structure review, or Comercio Exterior complement structure review. | Maintained official materials, expert review, module-specific test corpus. | Versioned scope, source list, explicit unsupported cases. | Calculation, filing, customs or labor advice. |
| **5. Regulated integrations** | PAC integration or other authorized workflow, only after a separate security/compliance project. | Contracted provider, security design, legal review, monitoring, incident response, retention controls. | Provider sandbox certification and operational acceptance criteria. | Claiming PAC status without authorization. |

The IMSS describes SUA as software for determining employer contribution amounts and related payment concepts; that is a separate maintained employer workflow, not a simple extension of a CFDI parser. [3] The SAT’s 2026 electronic-accounting annex describes data contents such as account catalogues, trial balances, policies, and supporting records, so an electronic-accounting module should be versioned and scoped independently. [4] SAT also publishes separate filling materials for payroll and Comercio Exterior, reinforcing that those are distinct, maintained domains. [5]

## Recommended next build milestone

**Stage 3: Professional fixture/QA workspace.**

Why this next:

1. Stages 1 and 2 now have documented, tested implementations.
2. It strengthens traceability without adding taxpayer data, a backend, or a commercial agreement.
3. It demonstrates maintainable engineering through deterministic manifests, test reports, and CI evidence.
4. It preserves the boundary between local fixture education and the narrow, explicit status client.

### Stage 3 acceptance contract

| Requirement | Done means |
|---|---|
| Traceability | Each fixture identifies its rule, expected visible result, and focused test. |
| Isolation | Fixture QA reporting is separate from teaching-rule execution and status lookup. |
| Security | Reports use synthetic fixture paths and no taxpayer data. |
| Evidence | A deterministic report and focused regression test exist. |
| Language | Output says “fixture QA result” and never “officially valid.” |
| Maintenance | Documentation describes how a new fixture and its expected result are reviewed. |

## Decisions required before the next phase

1. Approve **Stage 3** as the next build milestone, or freeze the executable scope after the current status connector.
2. Decide whether fixture traceability needs a machine-readable manifest or whether the existing documentation and tests remain sufficient.
3. Decide whether the eventual product remains **open source CLI-first** or gains a web application with an authenticated backend. This changes the security, privacy, storage, and deployment work substantially.

## References

[1] [SAT — Requisitos y obligaciones para proveedores de certificación](https://www.sat.gob.mx/minisitio/Factura/proveedores_requisitos.htm)

[2] [SAT — Documentación del Servicio de Consulta de CFDI, versión 1.3](https://www.sat.gob.mx/minisitio/Factura/documentos/cancelacion/ar_consulta_cfdi.pdf)

[3] [IMSS — SUA, Sistema Único de Autodeterminación](https://www.imss.gob.mx/patrones/sua)

[4] [SAT/DOF — Anexo 24 de la RMF 2026, Contabilidad en medios electrónicos](https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/anexos/Anexo_24_RMF2026-13012026.pdf)

[5] [SAT — Material de ayuda para facturar](https://www.sat.gob.mx/minisitio/Factura/emite_materialdeayudaparafactura.htm)
