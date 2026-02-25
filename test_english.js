// test_english.js — Natural English style tests for HyperianLang
const { HyperianLang } = require('./core.js');

let passed = 0, failed = 0;

async function test(name, src, check) {
  const hl = new HyperianLang(null);
  const world = {
    _vars: {},
    _props: {},
    getProperty(e, p) { return (this._props[e] || {})[p]; },
    setProperty(e, p, v) { if (!this._props[e]) this._props[e] = {}; this._props[e][p] = v; },
  };
  hl.setWorld(world);
  try {
    hl.load(src);
    await hl.run();
    const ok = check(world._vars);
    if (ok) { console.log(`  ✓ ${name}`); passed++; }
    else     { console.log(`  ✗ ${name}   vars=${JSON.stringify(world._vars)}`); failed++; }
  } catch (e) {
    console.log(`  ✗ ${name}   ERROR: ${e.message}`);
    failed++;
  }
}

(async () => {
  console.log('\n=== Natural English Style Tests ===\n');

  // ── Basic variable assignment with "be" ──────────────────────────────────
  console.log('-- let ... be ... --');
  await test('let x be 5', `let x be 5`, v => v.x === 5);
  await test('let name be string', `let name be "Kenneth"`, v => v.name === 'Kenneth');
  await test('let score be expression', `let score be 10 plus 5`, v => v.score === 15);

  // ── Multi-word variable names ────────────────────────────────────────────
  console.log('\n-- multi-word variable names --');
  await test('let player score be', `let player score be 100`, v => v.player_score === 100);
  await test('let the player name be', `let the player name be "Hero"`, v => v.player_name === 'Hero');
  await test('let running total be', `let running total be 0`, v => v.running_total === 0);
  await test('use multi-word in expression', `
let player score be 50
increase player score by 10
`, v => v.player_score === 60);

  // ── "the" is skipped as article ───────────────────────────────────────────
  console.log('\n-- article "the" handling --');
  await test('the player health be', `let the player health be 100`, v => v.player_health === 100);
  await test('increase the score by', `
let the score be 10
increase the score by 5
`, v => v.score === 15);

  // ── set ... to/be ─────────────────────────────────────────────────────────
  console.log('\n-- set ... to/be --');
  await test('set player level to', `
let player level be 1
set player level to 5
`, v => v.player_level === 5);
  await test('set player level be', `
let player level be 1
set player level be 10
`, v => v.player_level === 10);

  // ── increase/decrease multi-word ──────────────────────────────────────────
  console.log('\n-- increase/decrease multi-word --');
  await test('increase player gold by', `
let player gold be 100
increase player gold by 50
`, v => v.player_gold === 150);
  await test('decrease enemy health by', `
let enemy health be 50
decrease enemy health by 20
`, v => v.enemy_health === 30);

  // ── Conditions with multi-word ─────────────────────────────────────────────
  console.log('\n-- conditions with multi-word --');
  await test('if player health is greater than', `
let player health be 100
let status be "unknown"
if player health is greater than 50 then
  let status be "healthy"
end
`, v => v.status === 'healthy');

  // ── Arrays with English style ──────────────────────────────────────────────
  console.log('\n-- arrays English style --');
  await test('let the numbers be array', `let the numbers be array 1 2 3 4 5`, v => JSON.stringify(v.numbers) === '[1,2,3,4,5]');
  await test('transform with each item', `
let the numbers be array 1 2 3
transform the numbers with n into n plus n into doubled numbers
`, v => JSON.stringify(v.doubled_numbers) === '[2,4,6]');
  await test('every in multi-word', `
let the scores be array 80 90 85
every n in the scores is greater than 70 into all passed
`, v => v.all_passed === true);

  // ── Objects with English style ─────────────────────────────────────────────
  console.log('\n-- objects English style --');
  await test('let the player be object', `let the player be object "name" and "Hero" and "level" and 1`, v => v.player.name === 'Hero' && v.player.level === 1);
  await test('copy the config into', `
let the config be object "debug" and true
copy the config into backup config
`, v => v.backup_config && v.backup_config.debug === true);

  // ── Functions with English style ───────────────────────────────────────────
  console.log('\n-- functions English style --');
  await test('define function with descriptive name', `
define function "calculate damage" with base damage and multiplier
  let result be base damage times multiplier
  return result
end
call function "calculate damage" with 10 and 2 into final damage
`, v => v.final_damage === 20);

  // ── Match with English style ───────────────────────────────────────────────
  console.log('\n-- match English style --');
  await test('match the grade', `
let the score be 85
let the grade be "F"
match the score
  on greater than 89 then
    let the grade be "A"
  on greater than 79 then
    let the grade be "B"
  else
    let the grade be "C"
end
`, v => v.grade === 'B');

  // ── Compound natural sentences ─────────────────────────────────────────────
  console.log('\n-- compound sentences --');
  await test('full game-like script', `
let the player health be 100
let the player gold be 50
let the enemy damage be 15

decrease the player health by the enemy damage
increase the player gold by 10

if the player health is greater than 0 then
  let the player status be "alive"
else
  let the player status be "dead"
end
`, v => v.player_health === 85 && v.player_gold === 60 && v.player_status === 'alive');

  // ── summary ───────────────────────────────────────────────────────────────
  const total = passed + failed;
  console.log(`\n=== Results: ${passed}/${total} passed${failed ? ` (${failed} failed)` : ''} ===\n`);
  process.exit(failed > 0 ? 1 : 0);
})();
