// test_wave3.js — Wave-3 feature tests for HyperianLang
const { HyperianLang } = require('./core.js');

let passed = 0, failed = 0;

async function test(name, src, check) {
  const hl = new HyperianLang(null);
  // Minimal world shim with _vars
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
  console.log('\n=== Wave-3 Feature Tests ===\n');

  // ── math constants ───────────────────────────────────────────────────────
  console.log('-- math constants --');
  await test('math pi', `let x = math pi`, v => Math.abs(v.x - Math.PI) < 0.001);
  await test('math e',  `let x = math e`,  v => Math.abs(v.x - Math.E)  < 0.001);
  await test('math infinity', `let x = math infinity`, v => v.x === Infinity);
  await test('math tau',      `let x = math tau`,      v => Math.abs(v.x - Math.PI*2) < 0.001);
  await test('math nan',      `let x = math nan`,      v => isNaN(v.x));

  // ── define + call function ────────────────────────────────────────────────
  console.log('\n-- define function / call function --');
  await test('define + call function basic', `
define function "add" with a and b
  let result = a plus b
  return result
end
call function "add" with 5 and 3 into answer
`, v => v.answer === 8);

  await test('call function no args', `
define function "greet"
  let msg = "hello"
  return msg
end
call function "greet" into greeting
`, v => v.greeting === 'hello');

  await test('call function multiple calls', `
define function "double" with n
  return n plus n
end
call function "double" with 4 into a
call function "double" with a into b
`, v => v.a === 8 && v.b === 16);

  await test('return short-circuits', `
define function "check" with x
  if x is greater than 10
    return "big"
  end
  return "small"
end
call function "check" with 20 into r1
call function "check" with 5  into r2
`, v => v.r1 === 'big' && v.r2 === 'small');

  // ── match ─────────────────────────────────────────────────────────────────
  console.log('\n-- match --');
  await test('match exact value', `
let x = "b"
match x
  on "a" then
    let result = "got a"
  on "b" then
    let result = "got b"
  else
    let result = "other"
end
`, v => v.result === 'got b');

  await test('match else', `
let x = "z"
match x
  on "a" then
    let result = "got a"
  else
    let result = "other"
end
`, v => v.result === 'other');

  await test('match comparison', `
let score = 95
match score
  on greater than 90 then
    let grade = "A"
  on greater than 80 then
    let grade = "B"
  else
    let grade = "C"
end
`, v => v.grade === 'A');

  // ── transform ─────────────────────────────────────────────────────────────
  console.log('\n-- transform (map) --');
  await test('transform array', `
let nums = array 1 2 3 4
transform nums with n into n plus 1 into doubled
`, v => JSON.stringify(v.doubled) === '[2,3,4,5]');

  // ── reduce ────────────────────────────────────────────────────────────────
  console.log('\n-- reduce --');
  await test('reduce sum', `
let nums = array 1 2 3 4 5
reduce nums with total and item starting 0
  let total = total plus item
end into sum
`, v => v.sum === 15);

  // ── every / any ──────────────────────────────────────────────────────────
  console.log('\n-- every / any --');
  await test('every true', `
let nums = array 2 4 6 8
every n in nums is greater than 1 into allGt1
`, v => v.allGt1 === true);

  await test('every false', `
let nums = array 2 0 6
every n in nums is greater than 1 into allGt1
`, v => v.allGt1 === false);

  await test('any true', `
let nums = array 1 2 3
any n in nums is greater than 2 into hasGt2
`, v => v.hasGt2 === true);

  await test('any false', `
let nums = array 1 2 3
any n in nums is greater than 10 into hasGt10
`, v => v.hasGt10 === false);

  // ── copy obj ──────────────────────────────────────────────────────────────
  console.log('\n-- copy / assign --');
  await test('copy object', `
let obj = object "a" and 1 and "b" and 2
copy obj into obj2
set key "a" of obj2 to 99
`, v => v.obj.a === 1 && v.obj2.a === 99);

  await test('copy array', `
let arr = array 1 2 3
copy arr into arr2
`, v => JSON.stringify(v.arr2) === '[1,2,3]' && v.arr !== v.arr2);

  await test('assign merge', `
let a = object "x" and 1
let b = object "y" and 2
assign a and b into merged
`, v => v.merged.x === 1 && v.merged.y === 2);

  // ── path operations ───────────────────────────────────────────────────────
  console.log('\n-- path ops --');
  await test('join path', `
join path "/home/user" and "docs" and "file.txt" into p
`, v => v.p === '/home/user/docs/file.txt');

  await test('basename', `
basename of "/home/user/file.txt" into name
`, v => v.name === 'file.txt');

  await test('dirname', `
dirname of "/home/user/file.txt" into dir
`, v => v.dir === '/home/user');

  await test('extension', `
extension of "/home/user/file.txt" into ext
`, v => v.ext === '.txt');

  // ── log ───────────────────────────────────────────────────────────────────
  console.log('\n-- log statement --');
  await test('log does not throw', `
let x = 42
log "value is" x
`, v => v.x === 42);

  // ── inline math in function ───────────────────────────────────────────────
  console.log('\n-- compound / integration --');
  await test('function using math constant', `
define function "circleArea" with r
  let area = r plus r
  return area
end
call function "circleArea" with 5 into result
`, v => v.result === 10);

  await test('transform then reduce', `
let nums = array 1 2 3 4 5
transform nums with n into n plus n into doubled
reduce doubled with total and item starting 0
  let total = total plus item
end into sum
`, v => v.sum === 30);

  // ── summary ───────────────────────────────────────────────────────────────
  const total = passed + failed;
  console.log(`\n=== Results: ${passed}/${total} passed${failed ? ` (${failed} failed)` : ''} ===\n`);
  process.exit(failed > 0 ? 1 : 0);
})();
