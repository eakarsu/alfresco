'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const boundary = JSON.parse(fs.readFileSync(path.join(root, 'REFERENCE_BOUNDARY.json'), 'utf8'));
const errors = [];

if (boundary.decision !== 'quarantined_reference_prototype') errors.push('decision must remain quarantined_reference_prototype');
if (boundary.deployable_product !== false) errors.push('deployable_product must be false');
if (boundary.supported_entrypoint !== null) errors.push('supported_entrypoint must be null');
for (const field of ['owner', 'release_target', 'security_patch_owner']) {
  if (boundary.governance[field] !== null) errors.push(`${field} cannot be assigned without an approved extraction record`);
}
if (boundary.governance.license !== 'UNRESOLVED') errors.push('license cannot be inferred');

const launchers = ['start.sh', 'start-local.sh', 'stop.sh', 'stop-local.sh'];
for (const launcher of launchers) {
  const file = path.join(root, 'alfresco-ecm', launcher);
  const firstExecutableLines = fs.readFileSync(file, 'utf8').split('\n').slice(0, 12).join('\n');
  if (!firstExecutableLines.includes('REFERENCE SNAPSHOT: execution is disabled') || !firstExecutableLines.includes('exit 78')) {
    errors.push(`${launcher} is missing its fail-closed reference guard`);
  }
}

const readme = fs.readFileSync(path.join(root, 'alfresco-ecm', 'README.md'), 'utf8');
if (!readme.startsWith('# QUARANTINED REFERENCE PROTOTYPE')) errors.push('legacy README lacks the reference warning');
if (!readme.includes('UNVERIFIED LEGACY MATERIAL')) errors.push('legacy claims are not clearly labeled');

if (errors.length) {
  for (const error of errors) process.stderr.write(`boundary error: ${error}\n`);
  process.exit(1);
}
process.stdout.write('reference boundary verified; no product entry point is enabled\n');
