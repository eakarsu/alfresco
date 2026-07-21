# Product extraction checklist

No item is pre-approved. Record evidence and accountable approvers for every gate before changing `deployable_product`.

1. **Ownership and legal boundary** — name the product owner, engineering owner, security patch owner, data owner, and on-call owner; complete code/provenance, dependency-license, trademark, and intended-distribution review.
2. **Narrow product scope** — select one end-user journey and its users, acceptance criteria, non-goals, service boundary, repository/package destination, support term, and deprecation policy. Do not extract the legacy “all features” claim.
3. **Explicit entry point** — provide one fail-fast entry point, typed configuration contract, secret-manager references, least-privilege identity/tenant model, health/readiness checks, resource limits, and nondestructive install/migrate/start/stop commands.
4. **Data and domain controls** — define authoritative storage, migrations, idempotency, concurrency, audit, retention, deletion, backup/restore, and provider failure/reconciliation behavior for the selected journey.
5. **Evidence** — replace demo/static/generated behavior with risk-based unit, integration, authorization, migration, failure, browser/accessibility, security, load, restore, and rollback tests. Use representative licensed fixtures and record pass/fail thresholds.
6. **Delivery** — pin dependencies and base images, generate an SBOM, clear release-blocking vulnerabilities, sign artifacts, define environments and approvals, rehearse rollback and recovery, and publish owner-approved runbooks and incident contacts.
7. **Claim review** — separately substantiate every security, privacy, compliance, certification, performance, availability, compatibility, integration, and support statement. Remove any statement without dated independent evidence.

Approval of extraction does not prove the resulting product is Alfresco-compatible or grant permission to use Alfresco names or marks. Resolve that separately.
