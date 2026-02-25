# HyperianLang

**Natural English-style scripting language for Node.js and browsers.**

Write code that reads like plain English — no cryptic symbols, no complex syntax. A general-purpose scripting language perfect for beginners, rapid prototyping, automation, and anyone who wants readable, maintainable code.

```hyperianlang
let the user count be 100
let the growth rate be 1.5

if the user count is greater than 50 then
  let the projected users be the user count times the growth rate
  print "Projected users: "
  print the projected users
end
```

## Features

- **Natural English Syntax** — Write `let the item count be 0` instead of `let itemCount = 0`
- **Multi-word Variables** — Use descriptive names like `the response data` or `the current index`
- **English Math** — Write `10 plus 5`, `20 divided by 4`, `3 times 4`
- **Zero Dependencies** — Pure JavaScript, works in Node.js and browsers
- **VS Code Extension** — Syntax highlighting, snippets, and code intelligence
- **Full JS Interop** — Use alongside existing JavaScript code

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
if the balance is greater than 0 then
  print "Account active"
else
  print "Insufficient funds"
end

// Repeat loop
repeat 5 times
  print "Processing..."
end

// While loop
let the counter be 0
while the counter is less than 10
  increase the counter by 1
end
```

### Functions

```hyperianlang
define function "calculate total" with price and quantity
  return price times quantity
end

call function "calculate total" with 29.99 and 3 into the result
print the result  // 89.97
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

### Event Handlers

```hyperianlang
when app starts then
  set the connection status to "connected"
  print "Application initialized"
end

when user clicks on button then
  increase the click count by 1
  print "Button clicked!"
end
```

### Path Operations

```hyperianlang
let the folder be "src/utils"
let the file be "helpers.js"
join path the folder and the file into the full path
// "src/utils/helpers.js"

basename of the full path into the name
// "helpers.js"
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

Made with ❤️ for developers who prefer readable code.
