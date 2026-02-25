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
- **Whitespace Independent** — Indentation doesn't matter; structure code however you like
- **Zero Dependencies** — Pure JavaScript, works in Node.js and browsers
- **VS Code Extension** — Syntax highlighting, snippets, and code intelligence
- **Full JS Interop** — Use alongside existing JavaScript code

## Requirements

- **Node.js** — Version 18.0.0 or higher (tested up to v24.x)
- **No npm packages required** — HyperianLang is written in **vanilla JavaScript** with zero dependencies

### Why Vanilla JS?

HyperianLang is built entirely with pure JavaScript — no frameworks, no build tools, no `npm install`. Just clone and run. This means:

- ✅ No dependency vulnerabilities
- ✅ No version conflicts
- ✅ No bloated `node_modules` folder
- ✅ Works offline after cloning
- ✅ Easy to understand and modify the source code

### Check Your Version

```bash
node --version   # Should be v18.0.0 or higher
```

### Installing Node.js

**macOS/Linux (using nvm):**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

**Windows:**
Download from [nodejs.org](https://nodejs.org/) (LTS version recommended)

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

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

### Classes and OOP

HyperianLang supports object-oriented programming with English-like syntax. **Whitespace and indentation don't matter** — structure your code however you like.

#### Defining a Class

```hyperianlang
define class "Animal" with name and age
  define constructor with name and age
    set this name to name
    set this age to age
  end
  
  define method "speak" with no arguments
    print "Some animal sound"
  end
  
  define method "greet" with message
    print message
    print this name
  end
end
```

#### Inheritance

```hyperianlang
define class "Dog" extends "Animal"
  define method "speak" with no arguments
    print "Woof! Woof!"
  end
  
  define method "fetch" with item
    print "Fetching: "
    print item
  end
end
```

#### Creating Instances

```hyperianlang
# Create a new Animal
new "Animal" with "Tiger" and 5 into myPet

# Create a new Dog  
new "Dog" with "Rex" and 3 into myDog
```

#### Calling Methods

```hyperianlang
# Call a method with no arguments
call method "speak" on myDog

# Call a method with arguments
call method "greet" on myDog with "Hello, I am"
```

#### Complete Example

```hyperianlang
define class "Person" with name and email
  define constructor with name and email
    set this name to name
    set this email to email
  end
  
  define method "introduce" with no arguments
    print "Hi, I'm "
    print this name
  end
end

define class "Employee" extends "Person" with salary
  define method "work" with no arguments
    print this name
    print " is working..."
  end
  
  define method "getRaise" with amount
    increase this salary by amount
  end
end

new "Person" with "Alice" and "alice@email.com" into alice
new "Employee" with "Bob" and "bob@work.com" and 50000 into bob

call method "introduce" on alice
call method "work" on bob
call method "getRaise" on bob with 5000
```

#### OOP Syntax Summary

| Concept | Syntax |
|---------|--------|
| Define class | `define class "Name" with prop1 and prop2` |
| Constructor | `define constructor with args` |
| Method | `define method "name" with args` |
| No args | `with no arguments` |
| Inheritance | `define class "Child" extends "Parent"` |
| Create instance | `new "ClassName" with args into variable` |
| Access this | `this propertyName` or `set this prop to value` |
| Call method | `call method "name" on object with args` |

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

---

## HTTP Server Support

HyperianLang includes built-in HTTP server capabilities with English-like syntax.

### Starting a Server

```hyperianlang
start the server on port 3000
```

### Defining Routes

Use the `when the server receives` syntax to define route handlers:

```hyperianlang
# GET request
when the server receives a "GET" request to "/" then
  respond with { message: "Hello World" }
end

# POST request
when the server receives a "POST" request to "/users" then
  set userData to get the body from request
  respond with { success: true, data: userData }
end

# Route parameters
when the server receives a "GET" request to "/users/:id" then
  set params to get the params from request
  set userId to get id from params
  respond with { userId: userId }
end
```

### Responses

```hyperianlang
# JSON response (default)
respond with { status: "ok", data: users }

# With explicit status code
respond with 201 and { created: true }

# HTML response
send html "<html><body><h1>Hello</h1></body></html>"

# CSS response
send css "body { background: blue; }"
```

### Content-Type Auto-Detection

HyperianLang automatically detects content types:

| Content Starts With | Detected As |
|---------------------|-------------|
| `<!DOCTYPE` or `<html` | text/html |
| `<` with closing tags | text/html |
| `{` or `[` | application/json |
| CSS patterns (`.class {`, `body {`) | text/css |
| Other strings | text/plain |
| Objects/Arrays | application/json |

You can also force a content type:

```hyperianlang
send html "<h1>Hello</h1>"        # Forces text/html
send css "body { color: red; }"   # Forces text/css
respond with "data" as json       # Forces application/json
```

### Serving Static Files

```hyperianlang
# Serve an HTML file
serve file "public/index.html"

# Serve any static file (auto-detects MIME type)
serve file "public/styles.css"
serve file "public/script.js"
serve file "public/image.png"
```

### Request Data

Access request data using `get X from request`:

```hyperianlang
# Get request body (for POST/PUT)
set body to get the body from request

# Get URL parameters (for routes like /users/:id)
set params to get the params from request
set id to get id from params

# Get query parameters
set query to get the query from request
```

### Supported MIME Types

When serving files, the following MIME types are auto-detected:

| Extension | MIME Type |
|-----------|-----------|
| .html | text/html |
| .css | text/css |
| .js | application/javascript |
| .json | application/json |
| .png | image/png |
| .jpg, .jpeg | image/jpeg |
| .gif | image/gif |
| .svg | image/svg+xml |
| .ico | image/x-icon |
| .txt | text/plain |

---

## Using with Electron

HyperianLang works seamlessly with Electron for building desktop applications — **no JavaScript files required**.

### Quick Setup

```bash
# Install Electron in your project or globally
npm install electron --save-dev
```

### Run Your App

Use the `--electron` flag to run any HyperianLang file as a desktop app:

```bash
node run.js --electron myapp.hl
```

That's it! No `main.js`, no boilerplate — just your HyperianLang code.

### Example: Desktop Todo App (app.hl)

```hyperianlang
# HyperianLang Desktop App - Todo List

create a list called todos

define function "renderPage" with no arguments
  set html to "<!DOCTYPE html><html><head>"
  set html to html plus "<title>HyperianLang Todo App</title>"
  set html to html plus "<style>body{font-family:sans-serif;max-width:600px;margin:50px auto;}</style>"
  set html to html plus "</head><body>"
  set html to html plus "<h1>Todo List</h1>"
  set html to html plus "<form method='POST' action='/add'>"
  set html to html plus "<input name='task' placeholder='New task...'>"
  set html to html plus "<button>Add</button>"
  set html to html plus "</form><ul>"
  
  for each todo in todos
    set html to html plus "<li>" plus todo plus "</li>"
  end
  
  set html to html plus "</ul></body></html>"
  return html
end

when the server receives a "GET" request to "/" then
  call function "renderPage" into page
  send html page
end

when the server receives a "POST" request to "/add" then
  set body to get the body from request
  set task to get task from body
  append task to todos
  send html "<meta http-equiv='refresh' content='0;url=/'>"
end

start the server on port 3000
```

### Running the Desktop App

```bash
node run.js --electron app.hl
```

An Electron window opens and loads your HyperianLang server at `http://localhost:3000`.

### How It Works

The `--electron` flag:
1. Loads your `.hl` file and starts any HTTP servers
2. Launches Electron with a window pointing to `localhost:3000`
3. No JavaScript boilerplate needed — 100% HyperianLang

---

## Example: Complete Web Application

### webapp.hl

```hyperianlang
# HyperianLang Web Application

# Database for users
create a list called users
append { id: 1, name: "Alice", email: "alice@example.com" } to users
append { id: 2, name: "Bob", email: "bob@example.com" } to users

set nextId to 3

log "Starting web application..."

# Serve the main HTML page
when the server receives a "GET" request to "/" then
  serve file "public/index.html"
end

# API: Get all users
when the server receives a "GET" request to "/api/users" then
  respond with { success: true, data: users }
end

# API: Create a new user
when the server receives a "POST" request to "/api/users" then
  set userData to get the body from request
  set userName to get name from userData
  set userEmail to get email from userData
  set newUser to { id: nextId, name: userName, email: userEmail }
  append newUser to users
  increase nextId by 1
  respond with { success: true, user: newUser }
end

# API: Health check
when the server receives a "GET" request to "/api/health" then
  respond with { status: "ok", message: "Server is running" }
end

# Start the server
start the server on port 3000
```

### Running the Web App

```bash
node run.js webapp.hl
```

Then open http://localhost:3000 in your browser.

---

## License

MIT

---

Made with ❤️ for developers who prefer readable code.
