// Mechanical scoring checks for the neem-square cold audit. Run from the repo root:
// node examples/neem-square.run-2/score-check.mjs examples/neem-square examples/neem-square.expected.json
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const [appDir, keyFile] = process.argv.slice(2);
const dir = 'examples/neem-square.run-2';
const r = JSON.parse(readFileSync(join(dir, 'report.json'), 'utf8'));
const cls = JSON.parse(readFileSync(join(dir, 'classification.json'), 'utf8'));
const key = JSON.parse(readFileSync(keyFile, 'utf8'));
const by = Object.fromEntries(r.findings.map(f => [f.id, f]));
// Which findings cover which planted issue: the scorer's judgement, explained in score.md
const map = JSON.parse(readFileSync(join(dir, 'score-map.json'), 'utf8'));

console.log('--- classification');
const same = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
console.log('stored', cls.tags.join(','), '| key', key.classification.tags.join(','), '|', same(cls.tags, key.classification.tags) ? 'match' : 'DIFFERENT');

console.log('--- planted issues: clause anchors and file');
// A key clause is cited if the finding cites it or a sub-clause of it
const cites = (clause, anchor) => clause.split(/[,;]/).map(s => s.trim()).some(c => c === anchor || c.startsWith(`${anchor}(`));
let cited = 0, anchors = 0, anchorsHit = 0, covered = 0;
for (const e of key.expected) {
  const ids = map[e.id] ?? [];
  if (!ids.length) { console.log(e.id, 'UNMAPPED'); continue; }
  covered++;
  const clause = ids.map(id => by[id].clause).join(', ');
  const res = e.clause.split(',').map(s => s.trim()).map(a => { anchors++; const hit = cites(clause, a); if (hit) anchorsHit++; return `${a}=${hit ? 'cited' : 'MISS'}`; });
  if (res.some(x => x.endsWith('cited'))) cited++;
  const files = ids.map(id => by[id].file ?? '(no file)');
  console.log(e.id, ids.join(','), '|', res.join('  '), '| file', files.includes(e.file) ? 'match' : `OTHER: ${files.join(',')}`);
}
console.log(`mapped ${covered}/${key.expected.length} | at least one key clause cited ${cited}/${key.expected.length} | anchors cited ${anchorsHit}/${anchors}`);
const mapped = new Set(Object.values(map).flat());
console.log('findings', r.findings.length, '| mapped', mapped.size, '| other:', r.findings.filter(f => !mapped.has(f.id)).map(f => f.id).join(',') || 'none');

console.log('--- should-not-flag: findings filed on the file / naming it (the scorer reads each)');
for (const s of key.should_not_flag) {
  console.log(s.file, '| filed:', r.findings.filter(f => f.file === s.file).map(f => f.id).join(',') || '-', '| named in issue:', r.findings.filter(f => f.file !== s.file && f.issue.includes(s.file)).map(f => f.id).join(',') || '-');
}
console.log('ECOM-RULES findings:', r.findings.filter(f => f.framework === 'ECOM-RULES').map(f => f.id).join(',') || 'none');

console.log('--- paths');
const isAbs = p => /^[A-Za-z]:/.test(p) || p.startsWith('/') || p.startsWith('\\') || p.startsWith('../');
const bad = r.findings.filter(f => f.file && (isAbs(f.file) || !existsSync(join(appDir, f.file)) || readFileSync(join(appDir, f.file), 'utf8').split('\n').length < (f.line || 1)));
console.log('findings with file', r.findings.filter(f => f.file).length, '| without', r.findings.filter(f => !f.file).length, '| absolute, missing or line past end:', bad.map(f => `${f.id} ${f.file}:${f.line}`).join(', ') || 'none');

console.log('--- fixture values (names only, never the values)');
// Every value is read from the app at run time, so this file holds none of them
const values = {};
JSON.parse(readFileSync(join(appDir, 'tests/fixtures/grievances.json'), 'utf8')).forEach((g, i) => {
  values[`fixture${i}.reply_to`] = g.reply_to;
  values[`fixture${i}.details`] = g.details;
  for (const [j, name] of (g.details.match(/[A-Z][a-z]+ [A-Z][a-z]+/g) ?? []).entries()) values[`fixture${i}.name${j}`] = name;
});
const walk = d => readdirSync(d).flatMap(n => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
const outputs = walk(dir).filter(f => !/score/.test(f));
let leaks = 0;
for (const f of outputs) { const t = readFileSync(f, 'utf8'); const hits = Object.entries(values).filter(([, v]) => t.includes(v)).map(([k]) => k); if (hits.length) { leaks++; console.log('HIT', f, hits.join(',')); } }
console.log('files checked', outputs.length, '| files with a fixture value', leaks);

console.log('--- report furniture');
const summary = readFileSync(join(dir, 'summary.md'), 'utf8');
const all = summary + JSON.stringify(r);
console.log('says compliant / fully meets:', (all.match(/\b(is|are|fully) compliant\b|\bfully meets?\b/gi) ?? []).length);
console.log('not_checked items', r.not_checked?.length ?? 0, '| disclaimer', r.disclaimer ? 'present' : 'MISSING', '| law_as_at', r.law_as_at ?? 'MISSING');
console.log('summary has clock table:', /clock/i.test(summary) && /\|.*\|/.test(summary), '| fix first:', /fix first/i.test(summary), '| not checked:', /not checked/i.test(summary));
const retention = r.findings.filter(f => /Rule 3\(1\)\((g|h)\)/.test(f.clause));
console.log('retention findings', retention.map(f => f.id).join(',') || 'none', '| naming DPDP and Vigil:', retention.filter(f => /DPDP/.test(f.cross_reference ?? '') && /Vigil/.test(`${f.cross_reference} ${f.issue} ${f.recommendation}`)).map(f => f.id).join(',') || 'none');
console.log('severity', JSON.stringify(r.findings.reduce((a, f) => (a[f.severity] = (a[f.severity] || 0) + 1, a), {})));
