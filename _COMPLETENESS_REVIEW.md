# Completeness Review: alfresco

**Review date:** 2026-07-18

## Assessment basis

Static inspection of project-owned source and configuration only; no dependency installation, build, database migration, external-service call, or runtime launch was performed. The scan considered 144 project files (78 source files), 22 manifest(s), 4 test-like file(s), and 0 CI workflow(s), excluding dependency/generated directories.

## Classification

**Not an app**

This folder is best treated as source material, a library/tool, generated workspace, dependency cache, or portfolio container—not as an independently complete legal/document workflow app. App-completeness criteria therefore do not apply until a supported executable product boundary is defined.

## Why it is not a complete app

- No clear, independently supported end-user application boundary was identified in the inspected source/configuration.
- Ownership, release target, supported entry point, and acceptance criteria are absent or belong to an upstream/reference project.

## Needed features

1. Decide whether to retain this as an upstream/reference dependency, internal tool, archive, or source for extraction.
2. Document provenance, license, owner, supported version, update strategy, and security-patching responsibility.
3. If an app is intended, create a separate product boundary with an explicit entry point, user journey, configuration contract, tests, and release process.

## Risks or launch blockers

- Accidental deployment or unsupported modification could create security, licensing, and maintenance obligations.
- Treating this folder as an original product may obscure upstream provenance and update responsibility.

## Evidence inspected

- `alfresco-ecm/README.md`
- `alfresco-ecm/README.md:317`
- `codex-custom-viz-and-ops.html:15`
- `alfresco-ecm/apps/web/next-env.d.ts`
- `alfresco-ecm/tests/fixtures/database-seed.sql`
- `requirements.txt`

## Recommended next action

Record an explicit retain/extract/archive decision; only create an app roadmap if a supported product boundary and owner are assigned.

## Implementation progress (2026-07-19)

1. Recorded the explicit decision in `REFERENCE_BOUNDARY.json` and `REFERENCE_BOUNDARY.md`: retain this directory as a **quarantined reference prototype**, not a deployable application, upstream Alfresco fork, official distribution, or supported release. The machine-readable boundary sets `deployable_product` to false, exposes no supported entry point, freezes updates, and lists the evidence and activation gates. Historical start/stop scripts now exit with code 78 before any Docker, process, port, install, database, seed, or filesystem action; root package start/deploy/database aliases also fail closed.
2. Documented the current repository origin and reviewed commit, the nested README's “inspired by” provenance, the absence of a verified upstream repository/version, the absence of `LICENSE`/`NOTICE`/`COPYING` text, the unresolved license/trademark status, and the unassigned product/security ownership and support obligations. `DEPENDENCY_RISK.md` records rather than conceals the frozen runtime audit findings (one critical, two high, and two moderate dependency families). The legacy README now begins with a quarantine warning and labels its broad feature, enterprise-license, certification, compliance, performance, uptime, security, integration, credential, and support statements as unverified historical material.
3. Added `PRODUCT_EXTRACTION_CHECKLIST.md` defining the conditional path if an owner later intends an app: legal/provenance and named ownership, one narrow user journey, a separate product boundary and explicit fail-fast entry point, typed configuration and identity/tenant contracts, durable data/provider behavior, risk-based tests, SBOM/security gates, signed delivery, recovery, and claim-by-claim approval. No owner, license, upstream identity, or roadmap was invented. `scripts/verify-reference-boundary.cjs`, seven Node tests, and `.github/workflows/reference-boundary.yml` enforce the non-product decision and launcher ordering without application dependencies; all seven tests, four shell syntax checks, the boundary validator, and `git diff --check` passed on 2026-07-19.

External blockers are the intended result of this fail-closed implementation: a named accountable owner and security maintainer, written provenance/license/trademark determination, selected release target and supported journey, dependency remediation, credential and data review, extraction into an owned product boundary, and complete functional/security/operational acceptance evidence. Until those decisions exist, direct Docker/Kubernetes use and every product, compatibility, certification, compliance, performance, availability, security, or support claim remain prohibited; this project is ready to ledger only as a safely classified and quarantined non-app reference.

## Runtime and login acceptance — 2026-07-20

- **Status:** NOT_APPLICABLE
- **Startup safety:** the quarantined reference disposition and fail-closed historical launch paths were inspected.
- **Startup, readiness, login, and primary journey:** N/A; this folder has no supported application entry point or login surface, and direct runtime use is prohibited by its boundary.
- **Browser/server evidence:** N/A; no product server was launched.
- **Cleanup:** no runtime or disposable service was created.
- **Residual issue:** the documented ownership, provenance/license, extraction, dependency, and release decisions must close before a separate application can be validated.
