# HyperianLang

**Natural English-style scripting language for game development and automation.**

Write code that reads like plain English — no cryptic symbols, no complex syntax. Perfect for beginners, game designers, and anyone who wants readable, maintainable scripts.

```hyperianlang
let the player health be 100
let the enemy damage be 25

if the player health is greater than 0 then
  decrease the player health by the enemy damage
  print "Ouch! That hurt!"
end
```

## Features

- **Natural English Syntax** — Write `let the player score be 0` instead of `let playerScore = 0`
- **Multi-word Variables** — Use descriptive names like `the player health` or `the current level`
- **English Math** — Write `10 plus 5`, `20 divided by 4`, `3 times 4`
- **Zero Dependencies** — Pure JavaScript, works in Node.js and browsers
- **VS Code Extension** — Syntax highlighting, snippets, and code intelligence

## Installation

```bash
git clone https://github.com/theKennethy/HyperianLang.git
cd HyperianLang
```

### Node.js

```javascript
const { HyperianLang } = require('./core.js');

const hl = new HyperianLang();
hl.load(`
  let the message be "Hello, World!"
  print the message
`);
await hl.run();
```

### Browser

```html
<script src="core.js"></script>
<script>
  const hl = new HyperianLang();
  hl.load(`print "Hello from the browser!"`);
  hl.run();
</script>
```

## VS Code Extension

Install the extension for syntax highlighting:

```bash
cp -r vscode-hyperianlang ~/.vscode/extensions/hyperianlang
```

Then reload VS Code.

## Syntax Guide

### Variables

```hyperianlang
let x be 10
let the player name be "Hero"
let the inventory items be ["sword", "shield", "potion"]
let the player stats be {"health": 100, "gold": 50}
```

### Math Operations

```hyperianlang
let result be 10 plus 5          // 15
let result be 20 minus 8         // 12
let result be 4 times 3          // 12
let result be 20 divided by 4    // 5
let result be 6 multiplied by 7  // 42
```

### Control Flow

```hyperianlang
// If-else
if the player health is greater than 0 then
  print "Player is alive!"
else
  print "Game Over"
end

// Repeat loop
repeat 3 times
  print "Hello!"
end

// While loop
while the counter is less than 10
  increase the counter by 1
end
```

### Functions

```hyperianlang
define function "calculate damage" with base damage and multiplier
  return base damage times multiplier
end

call function "calculate damage" with 10 and 3 into the result
print the result  // 30
```

### Arrays

```hyperianlang
let the scores be [10, 20, 30, 40, 50]

// Transform (map)
transform the scores with n into n times 2 into doubled
// [20, 40, 60, 80, 100]

// Reduce (fold)
reduce the scores with total and value starting from 0 into the sum
  let total be total plus value
end
// 150

// Every (all match)
every item in the scores is greater than 0 into all positive
// true

// Any (some match)
any item in the scores is greater than 100 into has bonus
// false
```

### Match (Switch)

```hyperianlang
let the grade be "A"

match the grade
  on "A" then print "Excellent!"
  on "B" then print "Good job!"
  on "C" then print "Keep trying!"
  else print "Unknown grade"
end
```

### Event Handlers (Game Scripting)

```hyperianlang
when game starts then
  set the player health to 100
  print "Welcome to the adventure!"
end

when player clicks on enemy then
  decrease the enemy health by 10
end
```

### Path Operations

```hyperianlang
let the folder be "assets/images"
let the file be "hero.png"
join path the folder and the file into the full path
// "assets/images/hero.png"

basename of the full path into the name
// "hero.png"
```

## Comparison Operators

| English | Symbol |
|---------|--------|
| `is greater than` | `>` |
| `is less than` | `<` |
| `is equal to` / `equals` | `==` |
| `is not equal to` | `!=` |
| `and` | `&&` |
| `or` | `\|\|` |
| `not` | `!` |

## Built-in Actions

### Core
`let`, `set`, `increase`, `decrease`, `print`, `return`

### Arrays
`transform`, `reduce`, `filter`, `sort`, `reverse`, `every`, `any`, `copy`, `assign`

### Data
`append`, `split`, `join`, `trim`, `uppercase`, `lowercase`, `parse`, `stringify`

### Math
`round`, `floor`, `ceil`, `abs`, `sqrt`, `min`, `max`, `random`, `clamp`

### Path
`join path`, `basename`, `dirname`, `extname`

## Running Tests

```bash
node test_english.js   # English syntax tests
node test_wave3.js     # Feature tests
```

## License

MIT

---

Made with ❤️ for game developers and scripters who prefer readable code.
