# alfresco — Audit Note

## Bucket: A — DETECTOR_FALSE_POSITIVE

The original audit (batch_09.md, line 360) reported "Python. 0 routes, 0 AI endpoints. Verdict: Skeleton." This is a **false positive** — the project is actually a TypeScript/Node monorepo (alfresco-ecm) with substantial AI services, not a "Python skeleton."

## LLM Integration Evidence

- `/Users/erolakarsu/projects/alfresco/alfresco-ecm/services/ai/src/index.ts` — dedicated AI microservice (Express, port 3013) with routers for: classification, extraction, recognition, NLP, generation, translation, recommendation, search. Includes a comprehensive `AI_CAPABILITIES` registry covering auto-classification, metadata-extraction, smart-tagging, document-summarization, sentiment-analysis, entity-recognition, OCR, language detection, and more.

The full monorepo includes service directories: `admin`, `ai`, `analytics`, `audit`, `auth`, `cmis`, `collaboration`, `dam`, `document`, `email`, `forms`, `integration`, `notification`, `office`, `protocols`, `records`, `replication`, `search`, `smart-folders`, `transformation`, `workflow`. There are 76 source files outside `node_modules`. Build infrastructure is comprehensive: Docker Compose (local + prod), Kubernetes manifests, Turborepo, Playwright tests, click-test harness, full ECM (Enterprise Content Management) feature set.

## Genuinely Missing Audit-Recommended Features

The original audit had no domain-specific recommendations beyond labelling it "Unknown / Skeleton." Looking at the actual implementation, this is a high-maturity Alfresco-style ECM platform; the AI service already covers most document-intelligence capabilities (classification, extraction, summarization, NLP, translation, OCR via recognition routes). Plausible enhancement opportunities: deeper integration between the AI service and the records/workflow services for compliance-driven retention scheduling, generative-AI document drafting tied to forms/templates, and active-learning loops where user corrections in `dam` and `records` feed back into the classification models. None of these are foundational gaps.

## Apply pass — implemented

Nothing was modified. The audit produced no actionable recommendations, and the existing AI service (457-line `services/ai/src/index.ts` with 8 sub-routers and a capabilities registry covering 12+ AI features) is far more advanced than anything the audit suggested.

## Backlog (prioritized)

1. [PRODUCT-DECISION] AI ↔ records-service hooks for retention-driven classification (cross-service contract).
2. [PRODUCT-DECISION] Generative document drafting tied to `forms` / `office` templates.
3. [PRODUCT-DECISION + INFRA] Active-learning loop from `dam` / `records` user corrections back into classifier (label store, retraining trigger).

## Files touched in this pass

- `/Users/erolakarsu/projects/alfresco/_AUDIT_NOTE.md` (this file).

No source files were modified. Syntax: N/A.

## Apply pass 4 (mechanical backlog)

**Skipped** — backlog items are tagged INFRA + PRODUCT-DECISION (gateway pattern between Next.js `apps/web` and the AI microservice on port 3013) or PRODUCT-DECISION (records-service hooks, generative drafting, active-learning loop). The original audit produced no mechanical AI feature recommendations and the existing `services/ai/src/index.ts` capabilities registry is more advanced than anything the audit suggested. No mechanical work to apply.

## Apply pass 3 (frontend)

- **Stack:** Turborepo monorepo. Frontend `apps/web` is Next.js 14 App Router (deps: `next`, `react`, `react-dom`, TypeScript). AI is a separate Node/Express microservice on port 3013 (`services/ai/src/index.ts`).
- **Backend AI endpoints (verified):** `POST /api/v1/classify/auto`, `/extract/entities`, `/nlp/summarize`, `/search/semantic`, `/compliance/pii`, `/moderation/check`, `/nlp/qa`, plus sub-routers (`/api/v1/classification`, `/extraction`, `/recognition`, `/nlp`, `/generation`, `/translation`, `/recommendation`, `/search`).
- **FE coverage today:** None — `apps/web` is a static landing/demo (`page.tsx`, `/repository`, `/workflow`, `/records`, `/sites`, `/search`, `/admin`, `/profile`, `/demo/*`). The only `fetch` is `/api/auth/logout` in `components/Navigation.tsx`. No call reaches the AI service.
- **Action:** **LEFT-AS-IS** — wiring the browser to the `:3013` AI service requires either CORS config on the service or a Next.js route-handler proxy in `apps/web`, both of which touch infrastructure. The original audit produced no AI feature recommendations and the AI service is documented as more mature than anything the audit suggested. No speculative page added.
- **Backlog item added:** [INFRA + PRODUCT-DECISION] Decide gateway pattern (Next.js route-handler proxy vs. ingress CORS) and add a minimal AI demo page in `apps/web` (e.g. `/ai/summarize`, `/ai/classify`, `/ai/qa`) once the gateway is chosen.

