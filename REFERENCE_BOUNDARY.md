# Alfresco reference-boundary decision

## Decision

This directory is retained as a **quarantined reference prototype**, not an independently supported application and not an official Alfresco distribution. There is no supported runtime entry point, release target, deployment, certification, or service-level commitment.

The decision is fail-closed because local evidence does not identify a verified upstream fork/version, a checked-in license or notice, an accountable product/security owner, or acceptance evidence for the broad legacy claims. The current Git remote points to the workspace owner's repository, and the nested README says the prototype was only inspired by Alfresco Community Edition. That is not enough to infer ownership of upstream code, trademark permission, or an enterprise license.

`REFERENCE_BOUNDARY.json` is the machine-readable authority. Bundled start/stop scripts are quarantined before any process, container, port, database, seed, dependency-install, or filesystem action. Root package aliases also deny product start/deploy/database commands. Direct Docker/Kubernetes use is unsupported and prohibited by policy even though historical manifests remain for provenance inspection.

## Ownership, license, and updates

- Product owner: unassigned.
- Security-patching owner: unassigned.
- License: unresolved; no `LICENSE`, `NOTICE`, or `COPYING` file was found at review time. The legacy README's “Enterprise License” sentence is not license text.
- Upstream/version: unresolved; this is not recorded as a fork of an official Alfresco repository.
- Update strategy: frozen. Do not merge upstream, update dependencies, or ship patches as a supported distribution until provenance and ownership are resolved.
- Vulnerability handling: do not expose this code to production data or networks. If a credible vulnerability affects an accidental deployment, isolate it, preserve evidence, notify the infrastructure owner, and treat all embedded/default credentials as compromised.

The dated production-dependency findings are recorded in `DEPENDENCY_RISK.md`; they are release blockers and further evidence for keeping execution disabled.

## Allowed activity

Read-only inspection, inventory, and owner-approved extraction planning are allowed. `node scripts/verify-reference-boundary.cjs` and the boundary tests are the only supported executable checks. They do not launch application services or mutate external state.

## Prohibited claims

The legacy README is preserved as historical/aspirational material. Its checkmarks and statements about completeness, DoD certification, SOC 2, GDPR, HIPAA, performance, uptime, encryption, support, protocols, and integrations are unverified and must not be repeated as facts. Default/demo credentials are not an acceptance path.

If a real product is desired, follow `PRODUCT_EXTRACTION_CHECKLIST.md`. Extraction must occur in a separate repository or clearly isolated package so a new owner can establish provenance, licensing, supported behavior, and release evidence without converting this entire snapshot into an implied product.
