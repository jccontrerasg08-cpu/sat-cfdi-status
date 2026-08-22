# Diagram sources

This directory keeps the Mermaid source for the connected visual guide. The rendered PNG files live under `docs/assets/diagrams/` so GitHub and the portfolio can display them without requiring a Mermaid renderer.

| Diagram | Perspective | Reading question |
|---|---|---|
| `01-macro-system.mmd` | Macro system | How do a learner, website, repository, local CLI, fixtures, tests, and documentation form one evidence loop? |
| `02-local-boundary.mmd` | Macro boundary | What stays inside the local educational process, and what fiscal or remote actions are explicitly excluded? |
| `03-validation-dispatch.mmd` | Micro execution | How does each CLI mode move from local path to parse, root dispatch, issues, filtering, and JSON Lines? |
| `04-optional-tool-evaluation.mmd` | Micro comparison | How are `satcfdi` and `lxml` tried in an isolated environment without changing the core or crossing the network boundary? |

## Visual review

The system diagram confirms the intended evidence loop from learner to website/repository/local execution, then from fixture processing to JSON Lines and tests. The boundary diagram visibly separates synthetic local input, strict parsing, explicit rules, output, tests, and documentation from real invoices, credentials, remote services, and fiscal actions. The micro diagrams complete the picture by tracing core validation and optional local-tool comparison.

The validation diagram renders all three entry modes, the parse-failure stop, the five-root dispatch, optional filtering, and final JSON summary. The evaluation sequence shows that the optional virtual environment uses complete, minimal, and malformed synthetic fixtures only; it reaches `satcfdi`, `lxml`, and local JSON evidence while visibly terminating before SAT/PAC or credentialed paths.
