# KNOYA — AI Support & Knowledge Studio

Independent portfolio demonstration for Zylvoo Solutions.

## Existing functionality preserved
13 original modules: overview, source-grounded Q&A with citation viewer, source library, collections, search/retrieval, text/Markdown ingestion, evaluation suite, conversation history, feedback review, reports, local activity, integration guides, and settings.

## New functionality in redesign
1. **Support Inbox**: 6 sample tickets, filter, inspect evidence, create case, draft local reply and change status.
2. **Reply Templates**: five starter templates, create own, apply to selected support case.
3. **Escalation Rules**: toggle policy previews and inspect case flags (no server automation).
4. **Customer Widget Preview**: simulated knowledge Q&A with source references in a product widget.

## Truthful limitations
- Offline standalone HTML/CSS/JavaScript application, no backend or account access control.
- Source-grounded answers use lexical scoring and extraction from local sample documents, not OpenAI or an LLM, vector embeddings, or a deployed RAG engine.
- All customer names, businesses, tickets, activity, results and documents are fictional examples.
- Integrations are architecture outlines and not connected. Widget is a preview, not an installable widget.
- Browser localStorage persists records on supported browsers and is not secure storage.
- No email sends, customer notifications, OAuth, real support SLA enforcement, or production analytics.

## How to run
Open `01_Interactive_Demo/KNOYA_AI_Support_Studio.html` in Chrome/Edge. No internet access required.
