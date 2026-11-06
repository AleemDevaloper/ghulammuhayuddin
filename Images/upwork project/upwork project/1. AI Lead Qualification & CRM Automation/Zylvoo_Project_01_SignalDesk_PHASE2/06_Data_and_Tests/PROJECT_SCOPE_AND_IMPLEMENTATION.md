# SignalDesk - Project 01: Scope and implementation

## Portfolio classification
Independent product concept and interactive frontend demonstration built by Zylvoo Solutions. Synthetic records and illustrative figures are used. It is not a commissioned client project.

## Business problem
Business development teams need a unified way to review new leads, evaluate quality, assign owners, inspect pipeline movement, and approve follow-up communications before action.

## Functional areas delivered in the standalone HTML
- Lead operations overview: five KPI tiles, trends, source distribution, stage mix, activity and action checklists.
- Lead intelligence: searchable/filterable lead table, contact profile, score, engagements, timeline, stage editing, CSV export.
- Sales pipeline: five-column opportunity board, stage reassignment, risk/task sidebar, rolling summary.
- Approval queue: draft review, edit, approve/reject decisions with local audit events. No outbound email is sent.
- Workflow studio: visual flow, templates, node inspector, local test-run simulation. No external workflow engine is connected.
- Analytics: acquisition source, owner load, revenue calculations.
- Activity log and workspace settings.
- Local data persistence on supported browser environments; reset to starting data.

## Suggested production architecture (not deployed)
Frontend: React/Vue or Laravel Blade, Typescript/JavaScript, responsive design.
Backend: Laravel/Python APIs, PostgreSQL/MySQL, job queues, RBAC, audit logging.
Automation: n8n or custom workflow runner with credentials secured on server.
AI enrichment/qualification: OpenAI API with structured schema, prompt guards, human review, fallback for uncertain results.
CRM & email integrations: OAuth, webhook verification, idempotency, retry strategy, suppression/unsubscribe validation, approval before sending.

## Production acceptance criteria
- Authentication + role-based permissions
- Server-side validation and database persistence
- Integration credentials stored outside browser
- Nonblocking queue worker + retries / dead-letter queue
- Explainable score provenance
- Approval audit trail with timestamp and actor
- Email opt-out and regional compliance policies
- Record deduplication and reconciliation
- Dashboard aggregates derived from database records
- Monitoring, error reporting, backup and rollback

## Limitations
This portable HTML is a frontend proof of concept. It does not make real AI calls, send mail, connect to third-party CRMs, or execute live n8n jobs. The test-run action simulates completion locally. All companies and contacts are illustrative.
