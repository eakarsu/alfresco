'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const boundary = JSON.parse(fs.readFileSync(path.join(root, 'REFERENCE_BOUNDARY.json'), 'utf8'));

test('machine-readable decision does not imply a product, license, upstream, or owner', () => {
  assert.equal(boundary.deployable_product, false);
  assert.equal(boundary.supported_entrypoint, null);
  assert.equal(boundary.governance.owner, null);
  assert.equal(boundary.governance.security_patch_owner, null);
  assert.equal(boundary.governance.license, 'UNRESOLVED');
  assert.equal(boundary.provenance.upstream_repository, null);
  assert.equal(boundary.provenance.upstream_version, null);
});

test('boundary validator passes without application dependencies', () => {
  const result = spawnSync(process.execPath, ['scripts/verify-reference-boundary.cjs'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /no product entry point is enabled/);
});

test('every historical launcher exits before dangerous or external actions', () => {
  for (const name of ['start.sh', 'start-local.sh', 'stop.sh', 'stop-local.sh']) {
    const source = fs.readFileSync(path.join(root, 'alfresco-ecm', name), 'utf8');
    const guard = source.indexOf('exit 78');
    assert.ok(guard > 0, `${name} has no guard`);
    for (const operation of ['docker-compose', 'docker compose', 'kill -9', 'npm install', 'psql ', 'dropdb ', 'createdb ']) {
      const occurrence = source.indexOf(operation);
      if (occurrence !== -1) assert.ok(guard < occurrence, `${name} can reach ${operation} before its guard`);
    }
  }
});

test('root package exposes only reference checks and deny stubs', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'alfresco-ecm', 'package.json'), 'utf8'));
  for (const [name, command] of Object.entries(manifest.scripts)) {
    assert.match(command, /verify-reference-boundary|reference-boundary\.test|deny-reference-execution|npm run (verify:reference|test)/, `${name} is not boundary-safe`);
  }
  const denied = spawnSync(process.execPath, ['scripts/deny-reference-execution.cjs', 'test-action'], { cwd: root, encoding: 'utf8' });
  assert.equal(denied.status, 78);
  assert.match(denied.stderr, /execution is disabled/);
});

test('extraction checklist covers the required supported application boundary', () => {
  const checklist = fs.readFileSync(path.join(root, 'PRODUCT_EXTRACTION_CHECKLIST.md'), 'utf8');
  for (const evidence of ['Explicit entry point', 'typed configuration', 'identity/tenant', 'migrations', 'backup/restore', 'authorization', 'security', 'rollback']) {
    assert.match(checklist, new RegExp(evidence, 'i'));
  }
});

test('legacy claims and absent license are explicitly disclaimed', () => {
  const decision = fs.readFileSync(path.join(root, 'REFERENCE_BOUNDARY.md'), 'utf8');
  for (const claim of ['DoD', 'SOC 2', 'GDPR', 'HIPAA', 'uptime', 'performance']) assert.match(decision, new RegExp(claim));
  assert.match(decision, /no `LICENSE`, `NOTICE`, or `COPYING`/);
});

test('known production dependency findings are not hidden by the quarantine', () => {
  const risk = fs.readFileSync(path.join(root, 'DEPENDENCY_RISK.md'), 'utf8');
  assert.match(risk, /one critical/);
  assert.match(risk, /two high/);
  assert.match(risk, /must not be deployed/);
  assert.match(risk, /Security-patching responsibility remains unassigned/);
});
