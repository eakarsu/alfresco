# Frozen dependency risk inventory

The quarantined snapshot is not dependency-clean and must not be deployed. On 2026-07-19, `npm audit --package-lock-only --omit=dev` for `alfresco-ecm` reported five vulnerable production dependency families: one critical (`basic-ftp`), two high (`tar-fs`, `ws`), and two moderate (`ip-address`, `js-yaml`). This inventory is evidence for the quarantine, not a release waiver.

No owner is authorized to select breaking upgrades or certify regression behavior, so the review does not silently rewrite the frozen dependency graph. A future extraction owner must remove unused packages, update the selected journey's lockfile and base images, generate an SBOM, rerun security/license scanning, test the actual runtime, and clear every release-blocking finding before enabling an entry point.

Security-patching responsibility remains unassigned. If this snapshot is found running, isolate it and notify the infrastructure/security owner; do not wait for a patch from this directory.
