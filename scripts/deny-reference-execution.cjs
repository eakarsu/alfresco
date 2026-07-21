'use strict';

const action = process.argv[2] || 'application action';
process.stderr.write(`REFERENCE SNAPSHOT: execution is disabled for ${action}; see REFERENCE_BOUNDARY.md and extract an owned product first\n`);
process.exit(78);
