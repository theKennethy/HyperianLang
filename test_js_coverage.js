// JS Feature Coverage Test
const { HyperianLang } = require('./core.js');

async function test(name, code, check) {
  const hl = new HyperianLang();
  const world = {
    _vars: {},
    _props: {},
    getProperty(e, p) { return (this._props[e] || {})[p]; },
    setProperty(e, p, v) { if (!this._props[e]) this._props[e] = {}; this._props[e][p] = v; },
  };
  hl.setWorld(world);
  try {
    hl.load(code);
    await hl.run();
    if (check(world._vars)) {
      console.log('  ✓', name);
      return true;
    } else {
      console.log('  ✗', name, '— got:', JSON.stringify(world._vars));
      return false;
    }
  } catch (e) {
    console.log('  ✗', name, '— ERROR:', e.message);
    return false;
  }
}

(async () => {
  console.log('=== JS/Node.js Feature Coverage ===\n');
  
  const tests = [
    // --- CORE TYPES ---
    ['let with number', 'let x be 42', v => v.x === 42],
    ['let with string', 'let s be "hello"', v => v.s === 'hello'],
    ['let with boolean true', 'let b be true', v => v.b === true],
    ['let with boolean false', 'let b be false', v => v.b === false],
    ['let with null', 'let n be null', v => v.n === null],
    ['set variable', 'let x be 1\nset x to 2', v => v.x === 2],
    
    // --- ARRAYS ---
    ['array literal', 'let array be [1, 2, 3]', v => JSON.stringify(v.array) === '[1,2,3]'],
    ['nested array', 'let array be [[1, 2], [3, 4]]', v => v.array && v.array[0][0] === 1],
    ['empty array', 'let array be []', v => Array.isArray(v.array) && v.array.length === 0],
    
    // --- OBJECTS ---
    ['object literal', 'let object be {"a": 1, "b": 2}', v => v.object && v.object.a === 1],
    ['nested object', 'let object be {"user": {"name": "test"}}', v => v.object && v.object.user.name === 'test'],
    ['empty object', 'let object be {}', v => v.object && typeof v.object === 'object'],
    
    // --- MATH ---
    ['addition', 'let x be 10 plus 5', v => v.x === 15],
    ['subtraction', 'let x be 10 minus 3', v => v.x === 7],
    ['multiplication', 'let x be 4 times 5', v => v.x === 20],
    ['division', 'let x be 20 divided by 4', v => v.x === 5],
    ['math pi', 'let x be math pi', v => Math.abs(v.x - 3.14159) < 0.001],
    ['math e', 'let x be math e', v => Math.abs(v.x - 2.718) < 0.01],
    
    // --- CONDITIONS ---
    ['if true', 'let x be 0\nif true then\n  set x to 1\nend', v => v.x === 1],
    ['if false', 'let x be 0\nif false then\n  set x to 1\nend', v => v.x === 0],
    ['if else', 'let x be 0\nif false then\n  set x to 1\nelse\n  set x to 2\nend', v => v.x === 2],
    ['if greater than', 'let x be 0\nif 10 is greater than 5 then\n  set x to 1\nend', v => v.x === 1],
    ['if less than', 'let x be 0\nif 3 is less than 5 then\n  set x to 1\nend', v => v.x === 1],
    ['not true', 'let x be 0\nif not true then\n  set x to 1\nend', v => v.x === 0],
    ['not false', 'let x be 0\nif not false then\n  set x to 1\nend', v => v.x === 1],
    ['and condition', 'let x be 0\nif true and true then\n  set x to 1\nend', v => v.x === 1],
    ['or condition', 'let x be 0\nif false or true then\n  set x to 1\nend', v => v.x === 1],
    
    // --- LOOPS ---
    ['repeat times', 'let x be 0\nrepeat 5 times\n  increase x by 1\nend', v => v.x === 5],
    ['while loop', 'let x be 0\nwhile x is less than 3\n  increase x by 1\nend', v => v.x === 3],
    
    // --- FUNCTIONS ---
    ['define and call function', 'define function "double" with n\n  return n times 2\nend\ncall function "double" with 5 into result', v => v.result === 10],
    ['function with multiple params', 'define function "add" with a and b\n  return a plus b\nend\ncall function "add" with 3 and 7 into result', v => v.result === 10],
    ['function no return', 'define function "noop" with x\n  let y be x\nend\ncall function "noop" with 5 into result', v => v.result === undefined || v.result === null],
    
    // --- ARRAY METHODS ---
    ['transform (map)', 'let array be [1, 2, 3]\ntransform array with number into number times 2 into result', v => JSON.stringify(v.result) === '[2,4,6]'],
    ['reduce', 'let array be [1, 2, 3, 4]\nreduce array with total and number starting from 0 into sum\n  let total be total plus number\nend', v => v.sum === 10],
    ['every true', 'let array be [2, 4, 6]\nevery number in array is greater than 0 into result', v => v.result === true],
    ['every false', 'let array be [2, -1, 6]\nevery number in array is greater than 0 into result', v => v.result === false],
    ['any true', 'let array be [1, 2, 10]\nany number in array is greater than 5 into result', v => v.result === true],
    ['any false', 'let array be [1, 2, 3]\nany number in array is greater than 5 into result', v => v.result === false],
    
    // --- OBJECT METHODS ---
    ['copy (deep clone)', 'let orig be {"a": 1}\ncopy orig into clone', v => v.clone && v.clone.a === 1],
    ['assign (merge)', 'let a be {"x": 1}\nlet b be {"y": 2}\nassign a and b into merged', v => v.merged && v.merged.x === 1 && v.merged.y === 2],
    
    // --- MATCH/SWITCH ---
    ['match case 1', 'let x be "a"\nlet result be 0\nmatch x\n  on "a" then set result to 1\n  on "b" then set result to 2\nend', v => v.result === 1],
    ['match else', 'let x be "z"\nlet result be 0\nmatch x\n  on "a" then set result to 1\n  else set result to 99\nend', v => v.result === 99],
    
    // --- PATH OPERATIONS ---
    ['join path', 'let a be "folder"\nlet b be "file.txt"\njoin path a and b into result', v => v.result === 'folder/file.txt'],
    ['basename', 'let p be "dir/file.txt"\nbasename of p into result', v => v.result === 'file.txt'],
    
    // --- STRING WITH VARIABLES ---
    ['string variable reference', 'let name be "world"\nlet msg be name', v => v.msg === 'world'],
  ];
  
  let passed = 0, failed = 0;
  for (const [name, code, check] of tests) {
    if (await test(name, code, check)) passed++; else failed++;
  }
  
  console.log('\n=== ' + passed + '/' + (passed + failed) + ' passed ===');
  
  if (failed > 0) {
    console.log('\nSome features need work!');
    process.exit(1);
  } else {
    console.log('\nAll JS/Node.js features working!');
  }
})();
