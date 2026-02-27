# HyperianLang

**Natural English-style programming language with full JavaScript/Node.js parity.**

Write code that reads like plain English — no cryptic symbols, no complex syntax. HyperianLang compiles to JavaScript and supports everything vanilla JS and Node.js can do.

```hyperianlang
let the user count be 100
let the growth rate be 1.5

if the user count is greater than 50 then
  let the projected users be the user count times the growth rate
  say "Projected users: " plus the projected users
end if
```

## Features

- **Natural English Syntax** — Write `let the item count be 0` instead of `let itemCount = 0`
- **Multi-word Variables** — Use descriptive names like `the response data` or `the current index`
- **Full JS Parity** — Classes, async/await, generators, proxies, symbols, and more
- **Full Node.js Parity** — HTTP servers, file system, crypto, clusters, child processes
- **HTML Generation** — Write HTML using English sentences, no angle brackets required
- **CSS-in-HyperianLang** — Define stylesheets with English syntax including media queries and animations
- **Native DOM Elements** — Create DOM elements directly in client-side code
- **Electron Support** — Build desktop apps using HyperianLang
- **Zero Dependencies** — Pure vanilla JavaScript, works in Node.js and browsers
- **VS Code Extension** — Syntax highlighting and code intelligence

## Requirements

- **Node.js 18.0.0+** (tested up to v24.x)
- **No npm packages required** — zero dependencies

```bash
node --version   # Should be v18.0.0 or higher
```

## Installation

```bash
git clone https://github.com/theKennethy/HyperianLang.git
cd HyperianLang/hyperianlang
node run.js example.hl
```

### Project Structure

```
HyperianLang/
├── hyperianlang/          # Core runtime (for distribution)
│   ├── core.js            # Main interpreter
│   ├── run.js             # CLI runner
│   ├── runtime.js         # Runtime utilities
│   └── examples/          # Example .hl files
├── electron-example/      # Desktop app example
├── vscode-hyperianlang/   # VS Code extension
└── README.md
```

---

# Language Reference

## Variables

```hyperianlang
// Declaration
let name be "John"
let the player score be 100
let items be ["sword", "shield", "potion"]
let config be {host: "localhost", port: 3000}

// Assignment
set name to "Jane"
set the player score to 200

// Modify
increase the player score by 50
decrease the player score by 10
```

## Math Operations

```hyperianlang
let result be 10 plus 5           // 15
let result be 20 minus 8          // 12
let result be 4 times 3           // 12
let result be 20 divided by 4     // 5
let result be 10 mod 3            // 1
let result be 2 to the power of 8 // 256
```

### Math Functions

```hyperianlang
round 3.7 into rounded            // 4
floor 3.7 into floored            // 3
ceil 3.2 into ceiled              // 4
abs -5 into absolute              // 5
sqrt 16 into root                 // 4
random 1 to 100 into num          // random number 1-100
clamp value between 0 and 100 into clamped
min a and b into smaller
max a and b into larger
```

## Control Flow

### If/Else

```hyperianlang
if the balance is greater than 0 then
  say "Account active"
else if the balance equals 0 then
  say "Empty account"
else
  say "Overdrawn"
end if
```

### Loops

```hyperianlang
// Repeat N times
repeat 5 times
  say "Hello"
end repeat

// While loop
while the counter is less than 10
  increase the counter by 1
end while

// For each (arrays)
for each item in items do
  say item
end for

// Iterate object keys (for-in)
iterate keys of config do
  say key
end iterate
```

### Labeled Break/Continue

```hyperianlang
label outer
repeat 10 times
  repeat 10 times
    if condition then
      break outer
    end if
  end repeat
end repeat
```

### Match (Switch)

```hyperianlang
match the grade
  on "A" then say "Excellent!"
  on "B" then say "Good job!"
  on "C" then say "Keep trying!"
  else say "Unknown grade"
end match
```

## Comparison Operators

| English | JS Equivalent |
|---------|---------------|
| `is equal to` / `equals` | `===` |
| `is not equal to` | `!==` |
| `is greater than` | `>` |
| `is less than` | `<` |
| `is greater than or equal to` | `>=` |
| `is less than or equal to` | `<=` |
| `and` | `&&` |
| `or` | `\|\|` |
| `not` | `!` |

## Functions

```hyperianlang
// Define function
define greet with name then
  say "Hello, " plus name
end define

// Call function
call greet with "Alice"

// With return value
define add with a and b then
  return a plus b
end define

call add with 5 and 3 into result

// Default parameters
define greet with name defaults to "World" then
  say "Hello, " plus name
end define

// Arrow-style (inline)
define double with n then return n times 2

// Rest parameters
define sum with numbers... then
  reduce numbers with total and n starting from 0 into result
    set total to total plus n
  end reduce
  return result
end define
```

## Arrays

```hyperianlang
let scores be [10, 20, 30, 40, 50]

// Access
get index 0 of scores into first

// Modify
set index 0 of scores to 100
append 60 to scores
remove 30 from scores

// Transform (map)
transform scores with n into n times 2 into doubled

// Filter
filter scores where n is greater than 25 into high

// Reduce
reduce scores with total and n starting from 0 into sum
  set total to total plus n
end reduce

// Sort
sort scores into sorted
sort scores descending into reversed

// Other operations
reverse scores into reversed
flatten nested into flat
copy scores into backup
length of scores into count
```

### Array Predicates

```hyperianlang
every item in scores is greater than 0 into allPositive
any item in scores is greater than 100 into hasBonus
find item in scores where item is greater than 30 into found
```

## Objects

```hyperianlang
let person be {name: "Alice", age: 30}

// Access
get name from person into theName

// Modify
set key "email" in person to "alice@example.com"

// Shorthand properties
let name be "Bob"
let age be 25
let user be {name, age}  // {name: "Bob", age: 25}

// Computed property names
let key be "dynamicKey"
let obj be {[key]: "value"}

// Get keys/values
keys of person into keyList
values of person into valueList
entries of person into entryList

// Merge objects
merge defaults and overrides into config
assign source to target
copy person into clone
```

### Destructuring

```hyperianlang
// Object destructuring
destruct name and age from person

// Array destructuring
destruct first and second from items
```

## Strings

```hyperianlang
let text be "Hello World"

// Operations
uppercase text into upper
lowercase text into lower
trim text into trimmed
length of text into len

// Split/Join
split text by " " into words
join words with ", " into sentence

// Search
index of "World" in text into pos
includes "Hello" in text into found

// Slice
slice text from 0 to 5 into sub

// Replace
replace "World" with "Universe" in text into newText

// Pad
pad text to 20 with " " into padded

// Character access
char at 0 of text into firstChar
```

## Classes and OOP

```hyperianlang
define class Animal with name and age
  define constructor with name and age
    set this name to name
    set this age to age
  end constructor
  
  define method speak with no arguments
    say "Some sound"
  end method
  
  define method greet with message
    say message plus this name
  end method
end class

// Inheritance
define class Dog extends Animal
  define method speak with no arguments
    say "Woof!"
  end method
  
  define method fetch with item
    say "Fetching " plus item
  end method
end class

// Instantiation
new Animal with "Tiger" and 5 into myPet
new Dog with "Rex" and 3 into myDog

// Method calls
call method speak on myDog
call method greet on myDog with "Hello, I am "
```

## Error Handling

```hyperianlang
try
  // risky code
  call dangerousFunction
catch error
  say "Error: " plus error
finally
  say "Cleanup"
end try

// Throw errors
throw "Something went wrong"
throw new Error with "Custom error"
```

## Async/Await

```hyperianlang
// Await a promise
await fetch url into response

// Promise creation
promise resolve with data into p
promise reject with error into p

// Promise combinators
promise all promises into results
promise race promises into first
promise any promises into winner
```

## Generators

```hyperianlang
generator range with start and end
  let i be start
  while i is less than end
    yield i
    increase i by 1
  end while
end generator

// Use generator
call range with 1 and 5 into gen
```

## Advanced JavaScript Features

### Proxy

```hyperianlang
proxy target with handler into proxied
```

### Symbol

```hyperianlang
symbol "description" into sym
symbol for "key" into globalSym
```

### BigInt

```hyperianlang
bigint "9007199254740993" into big
```

### WeakMap/WeakSet

```hyperianlang
weakmap into cache
weakset into visited
```

### Reflect

```hyperianlang
reflect get target property into value
reflect set target property to value
reflect has target property into exists
```

### SharedArrayBuffer & Atomics

```hyperianlang
shared buffer size 1024 into sharedArr

atomic store 42 to sharedArr at 0
atomic load sharedArr at 0 into value
atomic add 10 to sharedArr at 0 into oldValue
atomic sub 5 from sharedArr at 0 into oldValue
```

---

# Node.js APIs

## File System

```hyperianlang
// Read file
read file "data.txt" into content

// Write file
write "Hello" to file "output.txt"

// Check existence
file exists "data.txt" into exists

// List directory
list files in "src" into files

// Delete file
delete file "temp.txt"
```

## Path Operations

```hyperianlang
join path "src" and "utils" and "helper.js" into fullPath
basename of fullPath into name
dirname of fullPath into dir
extname of fullPath into ext
```

## HTTP Client

```hyperianlang
// GET request
fetch "https://api.example.com/data" into response

// POST request
post data to "https://api.example.com/users" into response

// With headers
fetch url with headers into response
```

## HTTP Server

```hyperianlang
start the server on port 3000

when the server receives a "GET" request to "/" then
  respond with {message: "Hello World"}
end when

when the server receives a "POST" request to "/users" then
  set body to get the body from request
  respond with {success: true, data: body}
end when

when the server receives a "GET" request to "/users/:id" then
  set params to get the parameters from request
  respond with {userId: params id}
end when

// Serve static files
serve file "public/index.html"

// Response types
respond with 201 and {created: true}
send html "<h1>Hello</h1>"
send css "body { color: red; }"
```

## HTTPS Server

```hyperianlang
secure server on port 443 with key "server.key" and cert "server.crt"
```

## Crypto

```hyperianlang
// Hashing
hash "password" with "sha256" into hashed

// Encryption
encrypt "secret" with "aes-256-cbc" and key into encrypted
decrypt encrypted with "aes-256-cbc" and key into decrypted

// Random bytes
random bytes 32 into buffer
```

## Child Process

```hyperianlang
run command "ls -la" into output
run command "npm install" async into process
```

## OS Module

```hyperianlang
os platform into platform
os hostname into host
os cpus into cpuList
os memory into mem
os uptime into uptime
os homedir into home
os tmpdir into temp
```

## Cluster

```hyperianlang
cluster is primary into isPrimary
cluster workers into workerCount
cluster fork into worker
cluster on "exit" do
  say "Worker exited"
end cluster
```

## Worker Threads

```hyperianlang
worker "worker.js" into w
worker send message to w
worker on message from w do
  say "Received: " plus message
end worker
```

## Compression

```hyperianlang
compress data into compressed
decompress compressed into original
```

## Database (SQLite)

```hyperianlang
connect to database "app.db"

query "CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)"

insert into "users" values {name: "Alice"}

select from "users" where "name = 'Alice'" into results

update "users" set {name: "Bob"} where "id = 1"
```

## Database (MySQL)

Requires: `npm install mysql2`

```hyperianlang
connect to mysql "localhost" as "root" with password "secret" using database "myapp"

# With custom port
connect to mysql "localhost" as "admin" with password "pass" using database "shop" on port 3307

# Create table
query "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255))"

# Insert data
query "INSERT INTO users (name, email) VALUES (?, ?)" with userName, userEmail

# Select data
query "SELECT * FROM users WHERE id = ?" with userId into results

# Delete data
query "DELETE FROM users WHERE id = ?" with userId
```

## Database (MariaDB)

Requires: `npm install mysql2`

```hyperianlang
connect to mariadb "localhost" as "root" with password "secret" using database "myapp"

# With custom port
connect to mariadb "127.0.0.1" as "admin" with password "pass" using database "shop" on port 3307

# Uses same query syntax as MySQL
query "SELECT * FROM users" into users
```

## Database (PostgreSQL)

Requires: `npm install pg`

```hyperianlang
connect to postgres "localhost" as "postgres" with password "secret" using database "myapp"

# With custom port
connect to postgres "localhost" as "admin" with password "pass" using database "shop" on port 5433

# Create table (note: SERIAL for auto-increment)
query "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(255), email VARCHAR(255))"

# Insert with $1, $2 placeholders (PostgreSQL style)
query "INSERT INTO users (name, email) VALUES ($1, $2)" with userName, userEmail

# Insert with RETURNING to get the new row
query "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *" with userName, userEmail into newUser

# Select data
query "SELECT * FROM users WHERE id = $1" with userId into results

# Delete data
query "DELETE FROM users WHERE id = $1" with userId
```

## JSON

```hyperianlang
parse jsonString into data
stringify data into jsonString
```

## Environment

```hyperianlang
get env "NODE_ENV" into environment
set env "DEBUG" to "true"
```

## Assertions

```hyperianlang
assert value equals expected
assert value is greater than 0
assert condition with message "Must be true"
```

---

# HTML Generation

Generate HTML using natural English syntax — no angle brackets required.

## Basic Elements

```hyperianlang
html heading 1 "Welcome" into h1
html heading 2 "Subtitle" with class "sub" into h2
html paragraph "Hello world" with class "intro" into p
html span "inline text" with id "tag" into s

html link to "https://example.com" with text "Click here" into anchor
html image from "photo.jpg" with alt "My photo" into img
html button "Submit" with type "submit" and class "btn" into btn
html input with type "email" and name "email" and placeholder "Enter email" into inp
```

## Lists

```hyperianlang
html list ordered into ol
  html item "First item"
  html item "Second item"
  html item "Third item"
end list

html list unordered into ul
  html item "Apple"
  html item "Banana"
end list
```

## Tables

```hyperianlang
html table with class "data-table" into tbl
  html row
    html cell "Name"
    html cell "Age"
  end row
  html row
    html cell "Alice"
    html cell "30"
  end row
end table
```

## Forms

```hyperianlang
html form with action "/submit" and method "POST" into frm
  html label "Username:" with for "user"
  html input with type "text" and name "user" and id "user"
  html textarea with name "bio" and rows 4
  html select with name "country"
    html option "USA" with value "us"
    html option "UK" with value "uk"
  end select
  html button "Submit" with type "submit"
end form
```

## Document Structure

```hyperianlang
html document into page
  html head
    html title "My Page"
    html meta charset "utf-8"
    html link stylesheet "styles.css"
    html script file "app.js"
  end head
  html body
    html div with class "container"
      html heading 1 "Welcome"
      html paragraph "Content goes here"
    end div
  end body
end html

say page  // Outputs complete HTML document
```

## Container Elements

```hyperianlang
html div with class "wrapper" and id "main"
  html section with class "intro"
    html paragraph "Section content"
  end section
end div

// Also: header, footer, nav, article, aside, main
```

## Attributes

```hyperianlang
// Common attributes via 'with' and 'and':
html input with type "text" and name "field" and placeholder "Enter..." and required and disabled
html button "Click" with class "btn" and id "submit" and style "color: blue"
```

## Text Formatting

```hyperianlang
html bold "Important text"              // <strong>
html strong "Also important"            // <strong>
html italic "Emphasized text"           // <em>
html emphasis "Also emphasized"         // <em>
html code "const x = 42"                // <code>
html preformatted "Multi\nline\ncode"   // <pre>
html quote "Famous quote"               // <blockquote>
html mark "highlighted"                 // <mark>
html sub "subscript"                    // <sub> (e.g., H₂O)
html sup "superscript"                  // <sup> (e.g., x²)
html abbr "HTML" with title "HyperText Markup Language"  // <abbr>
html time "Jan 1, 2024" with datetime "2024-01-01"       // <time>
```

## Line Breaks & Rules

```hyperianlang
html paragraph "Line 1"
html break                              // <br>
html paragraph "Line 2"
html line                               // <hr>
```

## Media Elements

```hyperianlang
html video from "video.mp4" with controls and autoplay and loop
html audio from "audio.mp3" with controls and muted
html iframe from "https://example.com" with width 800 and height 600
html canvas with id "myCanvas" and width 400 and height 300
html svg with width 100 and height 100 "<circle cx='50' cy='50' r='40'/>"
```

## Details & Summary

```hyperianlang
html details with open
  html summary "Click to expand"
  html paragraph "Hidden content revealed!"
end details
```

## Figure & Caption

```hyperianlang
html figure
  html image from "photo.jpg" with alt "A photo"
  html caption "Figure 1: A beautiful photo"
end figure
```

## Progress & Meter

```hyperianlang
html progress with value 70 and max 100
html meter with value 0.6 and min 0 and max 1 and low 0.3 and high 0.8
```

## Datalist (Autocomplete)

```hyperianlang
html input with type "text" and list "browsers"
html datalist with id "browsers"
  html option "Chrome"
  html option "Firefox"
  html option "Safari"
end datalist
```

---

# CSS-in-HyperianLang

Write CSS using natural English syntax — no curly braces or colons required.

## CSS Rules

```hyperianlang
css rule ".button"
  use background to "blue"
  use color to "white"
  use padding to "10px 20px"
  use borderradius to "5px"
end rule

css rule "#header"
  background "linear-gradient(to right, blue, purple)"
  fontsize "24px"
  textalign "center"
end rule
```

## CSS Classes and IDs

```hyperianlang
css class "container"
  maxwidth "1200px"
  margin "0 auto"
  padding "20px"
end class

css id "main-content"
  display "flex"
  flexdirection "column"
  gap "20px"
end id
```

## Media Queries

```hyperianlang
css media "screen and (max-width: 768px)"
  rule ".container"
    padding "10px"
    flexdirection "column"
  end rule
  rule ".sidebar"
    display "none"
  end rule
end media

css responsive "(min-width: 1024px)"
  rule ".grid"
    gridtemplatecolumns "repeat(3, 1fr)"
  end rule
end responsive
```

## Keyframe Animations

```hyperianlang
css keyframes "fadeIn"
  at "0%"
    opacity "0"
    transform "translateY(-20px)"
  at "100%"
    opacity "1"
    transform "translateY(0)"
end keyframes

css animation "slideIn"
  frame "from"
    transform "translateX(-100%)"
  frame "to"
    transform "translateX(0)"
end animation
```

## Font Faces

```hyperianlang
css fontface "CustomFont"
  source "url('fonts/custom.woff2') format('woff2')"
  weight "400"
  style "normal"
end fontface
```

## CSS Variables

```hyperianlang
css variable "--primary-color" value "#3498db"
css variable "--spacing" value "16px"

css rule ".themed"
  use background to "var(--primary-color)"
  use padding to "var(--spacing)"
end rule
```

## Inline Styles

```hyperianlang
css inline ".urgent" with background "red" color "white" fontweight "bold" into urgentStyle
```

---

# Client-Side DOM Manipulation

Create and manipulate DOM elements directly in client-side scripts.

## Creating Elements

```hyperianlang
client script
  create element "div" into container
  create button "Click Me" into btn
  create paragraph "Hello World" into text
  create span "Inline text" into label
  create list item into li
end script
```

## Appending Elements

```hyperianlang
client script
  create element "ul" into list
  
  create list item into item1
  set text of item1 to "First item"
  append item1 to list
  
  create list item into item2
  set text of item2 to "Second item"
  append item2 to list
  
  append list to document body
end script
```

## Setting Attributes and Properties

```hyperianlang
client script
  create element "input" into field
  set attribute "type" of field to "email"
  set attribute "placeholder" of field to "Enter email"
  set class of field to "form-input"
  set id of field to "email-field"
end script
```

## Event Handling

```hyperianlang
client script
  when page loaded
    say "Page is ready"
  end when
  
  when "button" clicked
    say "Button was clicked"
  end when
  
  when "form" submitted
    prevent default
    say "Form submitted"
  end when
  
  when hash changes
    say "URL hash changed"
  end when
end script
```

## Selecting Elements

```hyperianlang
client script
  select "#myElement" into element
  select all ".items" into allItems
  
  set text of element to "Updated content"
end script
```

## Defining Functions

```hyperianlang
client script
  define function updateCounter with amount
    let current be get text of "#counter"
    let newValue be current plus amount
    set text of "#counter" to newValue
  end function
  
  define async function fetchData with url
    await fetch url into response
    return response
  end function
end script
```

---

# Electron Desktop Apps

Build desktop applications using HyperianLang. Everything runs in Electron with a minimal JavaScript wrapper.

## Quick Start

```bash
cd electron-example
npm install
npm start
```

## How It Works

The `electron-example/` folder demonstrates a complete desktop app:

```
electron-example/
├── app.hl          # Your entire app in HyperianLang
├── main.js         # Minimal Electron loader
└── package.json
```

## The app.hl file handles everything:

- **HTTP Server**: Routes and request handling
- **HTML Generation**: Dynamic page rendering
- **Data Management**: Variables, functions, state
- **Form Processing**: POST request handling

## Example App Structure

```hyperianlang
// Start the server
start the server on port 3000

// Define data
let todos be []

// Handle routes
when the server receives a "GET" request to "/" then
  set html to "<!DOCTYPE html><html>..."
  send html html
end when

when the server receives a "POST" request to "/add" then
  set body to get the body from request
  append body to todos
  respond with {success: true}
end when
```

## Run with Electron

```bash
cd electron-example
npm install
npm start
```

---

# VS Code Extension

Install the HyperianLang VS Code extension for syntax highlighting:

```bash
cp -r vscode-hyperianlang ~/.vscode/extensions/hyperianlang
```

Then reload VS Code.

---

# Examples

See the `hyperianlang/examples/` folder for complete examples:

- `example.hl` — Basic language features
- `server.hl` — HTTP server with routes
- `webapp.hl` — Full web application

---

# License

MIT

---

Made with ❤️ for developers who prefer readable code.
