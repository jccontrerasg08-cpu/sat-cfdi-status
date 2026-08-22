# CFDI Fixture Lab — Product Baseline

> **Status:** decision document. This file describes what exists today and the choices needed before the next feature is built.

## 1. The product in one sentence

**CFDI Fixture Lab is a local, synthetic XML rule laboratory for learning and demonstrating how an explainable validation pipeline is designed, tested, documented, and evolved.**

It is not an official CFDI validator, fiscal product, accounting system, payroll system, or customs tool. Its explicit SAT-status mode is a narrow public SOAP client, not a certification or compliance service. A clean result only means that the implemented local rules or bundled XSD profile did not emit a finding for that input; it never means acceptance by a public authority.

## 2. Who it is for

| Audience | Job to be done | What they need from the project |
|---|---|---|
| Developer or technical learner | Understand a small XML validation system end to end. | Runnable fixtures, clear rules, tests, and output contracts. |
| Product, business, or process analyst | See how requirements become observable system behavior. | A trace from scenario → rule → output → test. |
| Code reviewer or hiring team | Evaluate engineering judgment, scope control, and communication. | Small architecture, explicit non-goals, reproducible evidence, and readable documentation. |

## 3. The core loop

```text
synthetic XML path
  → parse locally
  → identify the supported local root
  → apply small deterministic rules
  → emit JSON Lines findings
  → verify with fixtures and unittest
```

The core loop accepts a local path or the checked-in demo corpus. The separate `--sat-status` mode accepts one explicitly supplied printed expression and returns a JSON object for the official Acuse. `--summary` aggregates local finding codes; `--catalog` describes the local contract without opening an XML file.

## 4. What exists now

| Capability | Current behavior | Product classification |
|---|---|---|
| Local XML parsing | Uses Python standard-library `ElementTree`; parse failures short-circuit with `xml_parse_error`. | **Core** |
| Root dispatch | Supports `Comprobante` plus four synthetic roots for ledger, trial balance, journal, and shipment lessons. | **Core** |
| Explainable findings | Every finding has `code`, `rule`, `message`, and `fragment`. | **Core** |
| Fixture-driven quality | 27 teaching XML files, two structural XSD fixtures, and 25 focused tests protect public behavior. | **Core** |
| CLI workflows | Validate paths, run `--demo`, add `--summary`, inspect `--catalog`, validate an offline XSD profile, preview a status request, or explicitly query SAT status once. | **Core** |
| Offline CFDI 4.0 structure profile | Uses a versioned local XSD bundle, manifest hashing, and secure no-network parsing. | **Professional foundation** |
| SAT status query | Validates a ConsultaCFDI expression locally and, only when requested, sends one public SOAP request without persisting or echoing identifiers; tests simulate SOAP transport. | **Professional foundation** |
| Synthetic accounting and trade lessons | Demonstrate namespaces and `Decimal` arithmetic without official schemas or calculations. | **Educational extensions** |
| Public-corpus review and adoption matrix | Show how external references were assessed without retaining third-party XML. | **Research artifacts** |
| Portfolio website | Explains the project, its evidence, sources, and creator capabilities. | **Presentation layer** |

## 5. Dependencies and deployment boundaries

| Layer | Required dependencies | Deliberately absent |
|---|---|---|
| Core CLI | Python 3.11+ standard library plus pinned `lxml` for the offline XSD profile. | Database, secrets, credentials, background workers, and network clients other than the opt-in public SAT-status request. |
| Core quality | `unittest` and GitHub Actions. | External fixture downloads, live test data. |
| Portfolio site | React, Vite, Tailwind, Lucide, and the static-site template. | Connection to the core at runtime, personal data collection, financial or legal calculations. |
| Assets | Versioned docs plus static visual assets. | User-uploaded XML storage. |

The website is a presentation and documentation surface. It does **not** execute the Python CLI in the browser. The core repository is the executable product.

## 6. Scope boundaries

| Inside the product | Outside the product |
|---|---|
| Synthetic XML, local parsing, deterministic rule examples, JSON Lines, tests, documentation, diagrams, and one explicit public SAT-status request. | Real CFDI files, PAC calls, certificates, signatures, stamping, cancellation workflows, bulk lookups, monitoring, payroll calculations, IMSS transactions, labor-case assessment, customs calculations, declarations, or user data storage. |

The synthetic accounting and shipment roots are teaching domains, not a commitment to become accounting or customs software.

## 7. Decisions that are still open

Before adding another feature, choose the desired primary product mode.

| Option | Primary value | Next work after choosing it | What we intentionally avoid |
|---|---|---|---|
| **A. Learning lab** | Teach rule-engine design with a compact, inspectable corpus. | Improve walkthroughs, add a rule authoring guide, simplify domains where needed. | Frameworks, service integrations, complete standards. |
| **B. Developer QA lab** | Help developers define and regression-test custom XML fixture rules. | Add a small rule manifest, fixture metadata, and a test-report command. | Official validation claims and generic plugin architecture. |
| **C. Portfolio case study** | Demonstrate analysis, engineering, quality, and product communication. | Curate the website and docs; freeze the executable feature set. | Feature accumulation not tied to evidence. |

The current repository contains parts of all three options. That explains why it feels broad. Selecting one as the primary mode will make future decisions straightforward; the other two can remain supporting lenses.

## 8. Recommended next direction

Start with **Option A: Learning lab**, with **Option C: Portfolio case study** as its presentation layer.

This keeps the product coherent: one executable teaching tool, one clear learning loop, and a website that proves the work. It avoids turning a small local XML laboratory into a partial fiscal platform.

If that direction is accepted, the next two milestones should be:

1. **Simplify and stabilize:** establish the supported roots as named lessons, label the accounting and trade roots as optional learning modules, and freeze the local-by-default boundary with its single opt-in SAT-status exception.
2. **Teach extension:** add a concise rule-authoring workflow that answers: “How do I add one new synthetic rule, fixture, and test safely?”

## 9. Product rule for future additions

No new feature is added until it has all five answers:

1. **User:** Who needs it and what task does it complete?
2. **Evidence:** Which fixture and expected output prove it?
3. **Boundary:** What adjacent capability does it explicitly *not* do?
4. **Cost:** Does Python’s standard library and the current design already cover it?
5. **Narrative:** Does it strengthen the chosen primary product mode?

If any answer is missing, the work stays in the roadmap rather than entering the codebase.
