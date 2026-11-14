import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, copyFileSync, writeFileSync, readFileSync, rmSync, cpSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadLayout, matchRule, checkFile, validate, clauseErrors, loadCatalog, workspaceRoot, frontmatterErrors } from '../lib.mjs';

const scripts = join(dirname(fileURLToPath(import.meta.url)), '..');
const repo = join(scripts, '..', '..');

function run(script, { cwd = repo, input, args = [] } = {}) {
  return spawnSync(process.execPath, [join(scripts, script), ...args], {
    cwd, input: typeof input === 'string' ? input : input && JSON.stringify(input), encoding: 'utf8',
  });
}

// A throwaway workspace with the real layout, schemas and catalog.
function workspace() {
  const dir = mkdtempSync(join(tmpdir(), 'nodal-'));
  cpSync(join(repo, '.claude/schemas'), join(dir, '.claude/schemas'), { recursive: true });
  cpSync(join(repo, 'catalog'), join(dir, 'catalog'), { recursive: true });
  copyFileSync(join(repo, 'package.json'), join(dir, 'package.json'));
  mkdirSync(join(dir, 'company-profile/acme'), { recursive: true });
  return dir;
}

const finding = { id: 'F-0001', severity: 'high', framework: 'IT-RULES', clause: 'Rule 3(2)(a)', issue: 'x', recommendation: 'y' };
const report = {
  assessment_id: 'a1', company_id: 'acme', scope: ['IT-RULES'], classification_tags: ['intermediary'], started_at: '2026-11-14T10:00:00Z',
  findings: [finding], not_checked: ['DPDP Act: use Vigil'], disclaimer: 'Compliance tooling, not legal advice.',
};

function writeReport(dir, value, id = 'a1') {
  mkdirSync(join(dir, 'assessments', id), { recursive: true });
  writeFileSync(join(dir, 'assessments', id, 'report.json'), JSON.stringify(value));
  return `assessments/${id}/report.json`;
}

test('the tracked workspace passes strict validation', () => {
  const dir = workspace();
  for (const d of ['.claude/skills', 'examples']) cpSync(join(repo, d), join(dir, d), { recursive: true });
  const r = run('validate.mjs', { cwd: dir, args: ['--strict'] });
  assert.equal(r.status, 0, r.stderr);
  rmSync(dir, { recursive: true });
});

test('layout matches data paths and rejects strays', () => {
  const layout = loadLayout(repo);
  assert.equal(matchRule(layout, 'company-profile/acme/classification.json').schema, 'classification.schema.json');
  assert.equal(matchRule(layout, 'assessments/a1/report.json').schema, 'report.schema.json');
  assert.equal(matchRule(layout, 'examples/app.run-1/report.json').schema, 'report.schema.json');
  assert.ok(matchRule(layout, 'assessments/a1/drafts/grievance-officer-page.md'));
  assert.equal(matchRule(layout, 'company-profile/acme/notes.txt'), undefined);
  assert.equal(matchRule(layout, 'src/app.js'), undefined);
});

test('agents cannot write the guards that bind them', () => {
  const layout = loadLayout(repo);
  // catalog/rules.json decides which clauses a finding may cite and carries the verified flags; package.json: `npm test` is pre-approved, so its scripts are a guard too
  for (const p of ['.claude/scripts/write-guard.mjs', '.claude/schemas/layout.json', '.claude/schemas/finding.schema.json', '.claude/settings.json', '.claude/settings.local.json', 'catalog/rules.json', 'package.json', 'package-lock.json']) {
    assert.equal(matchRule(layout, p), undefined, p);
  }
  assert.ok(matchRule(layout, '.claude/skills/audit/SKILL.md'));
});

test('validator catches schema violations', () => {
  const schema = JSON.parse(readFileSync(join(repo, '.claude/schemas/finding.schema.json'), 'utf8'));
  assert.deepEqual(validate(schema, finding, '$', repo), []);
  const errors = validate(schema, { id: 'F-1', severity: 'severe', framework: 'DPDP', issue: 'x', recommendation: 'y', extra: 1 }, '$', repo);
  assert.equal(errors.length, 5, errors.join('\n')); // bad id, bad severity, bad framework, missing clause, unexpected property
  assert.throws(() => validate({ oneOf: [] }, 1), /Unsupported schema keyword/);
});

test('finding locations: relative files and clean public URLs', () => {
  const schema = JSON.parse(readFileSync(join(repo, '.claude/schemas/finding.schema.json'), 'utf8'));
  assert.deepEqual(validate(schema, { ...finding, file: 'web/templates/footer.html', line: 3 }, '$', repo), []);
  for (const file of ['C:\\Users\\me\\app\\x.html', '/home/me/app/x.html', '../app/x.html']) {
    assert.equal(validate(schema, { ...finding, file }, '$', repo).length, 1, file);
  }
  assert.deepEqual(validate(schema, { ...finding, url: 'https://example.test/grievance' }, '$', repo), []);
  for (const url of ['example.test/grievance', 'https://example.test/t?email=a@example.test', 'https://example.test/t#x']) {
    assert.equal(validate(schema, { ...finding, url }, '$', repo).length, 1, url);
  }
});

test('a clause must be in the catalog for its framework', () => {
  const errors = (framework, clause) => clauseErrors({ framework, clause }, '$', repo);
  for (const clause of ['Rule 3(2)(a)', 'Rule 3(2)(a)(i), Rule 4(1)(c)', 'Rule 3(3)(a)(ii); Rule 3(3)(b)', 'Rule 3(1)(b)(vii)', 'Rule 3A(3)', 'Rule 4(1A)(a)']) assert.deepEqual(errors('IT-RULES', clause), [], clause);
  assert.deepEqual(errors('ECOM-RULES', 'Rule 4(4), Rule 4(5)'), []);
  assert.match(errors('IT-RULES', 'Rule 99').join(), /not a IT-RULES clause in catalog/);
  assert.match(errors('IT-RULES', 'Rule 3').join(), /not a IT-RULES clause/, 'a bare rule number is too loose to cite');
  assert.match(errors('IT-RULES', 'Rule 3(1)(dd)').join(), /not a IT-RULES clause/, 'a prefix match must stop at a bracket');
  assert.match(errors('ECOM-RULES', 'Rule 3(2)(a)').join(), /not a ECOM-RULES clause/, 'an IT Rules clause under the wrong framework');
  assert.match(errors('IT-RULES', 'DPDP s.8(7)').join(), /cross_reference/, 'another instrument is not an IT Rules clause');
  assert.match(errors('IT-RULES', ' ').join(), /names no reference/);
});

test('the catalog is well formed and says what was not read', () => {
  assert.deepEqual(checkFile('catalog/rules.json', repo), []);
  const { rules, instruments } = loadCatalog(repo);
  for (const code of ['IT-RULES', 'ECOM-RULES']) assert.ok(rules.some(r => r.instrument === code), code);
  // A rule is verified only against a gazette text someone read.
  const read = new Set(instruments.flatMap(i => i.notifications).filter(n => n.read).map(n => n.source_url));
  for (const r of rules.filter(r => r.verified)) assert.ok(read.has(r.source_url), `${r.id} is verified against a notification marked unread`);
  const dir = workspace();
  const catalog = JSON.parse(readFileSync(join(dir, 'catalog/rules.json'), 'utf8'));
  catalog.rules.push(catalog.rules[0]);
  writeFileSync(join(dir, 'catalog/rules.json'), JSON.stringify(catalog));
  assert.match(checkFile('catalog/rules.json', dir).join(), /duplicate id/);
  rmSync(dir, { recursive: true });
});

test('a report needs valid findings, the not-checked list and the disclaimer', () => {
  const dir = workspace();
  assert.deepEqual(checkFile(writeReport(dir, report), dir), []);
  const { clause, ...noClause } = finding;
  assert.match(checkFile(writeReport(dir, { ...report, findings: [noClause] }), dir).join(), /findings\[0\]: missing required "clause"/);
  assert.match(checkFile(writeReport(dir, { ...report, findings: [{ ...finding, clause: 'Rule 999' }] }), dir).join(), /findings\[0\]\.clause: "Rule 999" is not a IT-RULES clause/);
  const { not_checked, disclaimer, ...bare } = report;
  const errors = checkFile(writeReport(dir, bare), dir).join();
  assert.match(errors, /missing required "not_checked"/);
  assert.match(errors, /missing required "disclaimer"/);
  assert.match(checkFile(writeReport(dir, { ...report, not_checked: [] }), dir).join(), /needs at least 1/);
  rmSync(dir, { recursive: true });
});

test('write-guard enforces the layout', () => {
  const dir = workspace();
  const guard = file_path => run('write-guard.mjs', { cwd: dir, input: { tool_name: 'Write', tool_input: { file_path, content: 'hi' } } }).status;
  assert.equal(guard('README.md'), 0);
  assert.equal(guard('assessments/a1/summary.md'), 0);
  assert.equal(guard('src/app.js'), 2);
  assert.equal(guard('catalog/rules.json'), 2, 'an agent must not flip a verified flag');
  assert.equal(guard('../elsewhere/x.md'), 2);
  rmSync(dir, { recursive: true });
});

test('write-guard catches key formats and leaves ordinary prose alone', () => {
  const dir = workspace();
  const guard = content => run('write-guard.mjs', { cwd: dir, input: { tool_name: 'Write', tool_input: { file_path: 'README.md', content } } }).status;
  const secrets = [
    'key AKIA' + 'Q'.repeat(16),
    'ghp_' + 'a'.repeat(36),
    'github_pat_' + 'a'.repeat(40),
    'sk-ant-api03-' + 'a'.repeat(32),
    '-----BEGIN OPENSSH ' + 'PRIVATE KEY-----',
    'pass' + 'word=plainvalue',
    '{"pass' + 'word":"quotedvalue"}',
    'pass' + 'word: Sup3rvalue',
  ];
  for (const s of secrets) assert.equal(guard(s), 2, s);
  for (const s of ['Admin pass' + 'word: hardcoded in config/settings.py', 'The takedown runbook uses tokens sparingly']) assert.equal(guard(s), 0, s);
  rmSync(dir, { recursive: true });
});

test('write-guard keeps identifiers out of company and assessment data', () => {
  const dir = workspace();
  const guard = (file_path, content) => run('write-guard.mjs', { cwd: dir, input: { tool_name: 'Write', tool_input: { file_path, content } } }).status;
  const summary = 'assessments/a1/summary.md';
  assert.equal(guard(summary, 'Complainant Aadhaar 9999 7165 8847 in the ticket'), 2); // synthetic: a UIDAI test number
  assert.equal(guard(summary, 'PAN ABCPE1234F in the ticket'), 2);
  assert.equal(guard(summary, 'complainant mobile +91 9000000000'), 2);
  assert.equal(guard(summary, 'The Grievance Officer is named on web/templates/grievance.html'), 0);
  assert.equal(guard('docs/guide.md', 'PAN format example ABCPE1234F'), 0, 'documentation is out of scope');
  rmSync(dir, { recursive: true });
});

test('hooks find the workspace from a subdirectory and block with exit 2', () => {
  const dir = workspace();
  mkdirSync(join(dir, 'docs/deep'), { recursive: true });
  const cwd = join(dir, 'docs/deep');
  assert.equal(workspaceRoot(cwd), workspaceRoot(dir));
  const blocked = run('write-guard.mjs', { cwd, input: { tool_name: 'Write', tool_input: { file_path: join(dir, 'src/app.js'), content: 'x' } } });
  assert.equal(blocked.status, 2, blocked.stderr);
  const viaEvent = run('write-guard.mjs', { cwd: tmpdir(), input: { cwd, tool_name: 'Write', tool_input: { file_path: join(dir, 'src/app.js'), content: 'x' } } });
  assert.equal(viaEvent.status, 2, viaEvent.stderr);
  rmSync(dir, { recursive: true });
});

test('write-guard fails closed on events it cannot read', () => {
  const dir = workspace();
  const guard = input => run('write-guard.mjs', { cwd: dir, input }).status;
  for (const input of ['', 'not json', 'null', '{}', { tool_name: 'Write' }, { tool_name: 'Write', tool_input: {} }, { tool_name: 'Edit', tool_input: { file_path: '' } }]) {
    assert.equal(guard(input), 2, JSON.stringify(input));
  }
  assert.equal(guard({ tool_name: 'TodoWrite', tool_input: { todos: [] } }), 0, 'a tool that writes no file, caught by a loose matcher');
  assert.equal(guard({ tool_name: 'NotebookEdit', tool_input: { notebook_path: 'src/x.ipynb', new_source: 'x' } }), 2);
  writeFileSync(join(dir, '.claude/schemas/layout.json'), '{ not json');
  assert.equal(guard({ tool_name: 'Write', tool_input: { file_path: 'README.md', content: 'x' } }), 2, 'a broken layout blocks');
  rmSync(dir, { recursive: true });
});

test('validate-on-write exits 2 so the agent sees schema errors', () => {
  const dir = workspace();
  writeFileSync(join(dir, 'company-profile/acme/classification.json'), '{"company_id":"acme"}');
  const r = run('validate-on-write.mjs', { cwd: dir, input: { tool_input: { file_path: 'company-profile/acme/classification.json' } } });
  assert.equal(r.status, 2);
  assert.match(r.stderr, /missing required "tags"/);
  assert.equal(run('validate-on-write.mjs', { cwd: dir, input: 'not json' }).status, 2, 'an unreadable event must not pass silently');
  rmSync(dir, { recursive: true });
});

test('frontmatter must be valid YAML', () => {
  const skill = description => `---\nname: x\ndescription: ${description}\n---\n`;
  assert.deepEqual(frontmatterErrors(skill('Plain text. Use for things.'), 'x'), []);
  assert.deepEqual(frontmatterErrors(skill('"Quoted: with a colon and \\"inner\\" quotes."'), 'x'), []);
  assert.match(frontmatterErrors(skill('Bare: colon'), 'x').join(), /not valid YAML/);
  assert.match(frontmatterErrors('---\nname: y\n---\n', 'x').join(), /needs "name: x".*needs a description/);
});

test('SARIF carries located open findings and names what it left out', () => {
  const dir = workspace();
  const findings = [
    { ...finding, file: 'web/templates/grievance.html', line: 12 },
    { ...finding, id: 'F-0002', clause: 'Rule 3(1)(d)', severity: 'critical' }, // a missing runbook: no file
    { ...finding, id: 'F-0003', url: 'https://example.test/contact' }, // seen on a live page only
    { ...finding, id: 'F-0004', file: 'config/support.yaml', status: 'remediated' },
  ];
  writeReport(dir, { ...report, findings });
  const out = join(dir, 'x.sarif');
  const r = run('export-sarif.mjs', { cwd: dir, args: ['--company', 'acme', '--output', out] });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /no file to point at: F-0002, F-0003/);
  assert.match(r.stdout, /remediated or accepted: F-0004/);
  const { tool, results } = JSON.parse(readFileSync(out, 'utf8')).runs[0];
  assert.equal(results.length, 1);
  assert.equal(results[0].ruleId, 'IT-RULES-Rule-3-2-a');
  for (const rule of tool.driver.rules) assert.ok(rule.shortDescription.text && rule.fullDescription.text && rule.help.text, rule.id);
  const none = run('export-sarif.mjs', { cwd: dir, args: ['--company', 'nobody', '--output', join(dir, 'nobody.sarif')] });
  assert.equal(none.status, 1);
  assert.match(none.stderr, /No report found/);
  assert.equal(existsSync(join(dir, 'nobody.sarif')), false);
  rmSync(dir, { recursive: true });
});

test('hook commands find the guard, even when the project dir is stale', { skip: process.platform === 'win32' }, () => { // bash on Windows may resolve to WSL
  const { hooks } = JSON.parse(readFileSync(join(repo, '.claude/settings.json'), 'utf8'));
  const hook = (event, cwd, projectDir, file) => spawnSync('bash', ['-c', hooks[event][0].hooks[0].command], {
    cwd, encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: projectDir },
    input: JSON.stringify({ tool_name: 'Write', tool_input: { file_path: join(repo, file), content: 'x' } }),
  }).status;
  assert.equal(hook('PreToolUse', repo, repo, 'src/app.js'), 2);
  assert.equal(hook('PreToolUse', repo, repo, 'README.md'), 0);
  assert.equal(hook('PreToolUse', join(repo, 'examples'), repo, 'src/app.js'), 2, 'after a cd');
  assert.equal(hook('PreToolUse', repo, '/no/such/dir', 'src/app.js'), 2, 'session moved in from elsewhere');
  assert.equal(hook('PostToolUse', repo, '/no/such/dir', 'README.md'), 0);
  assert.equal(hooks.PreToolUse[0].hooks[0].onFailure, 'block');
});
