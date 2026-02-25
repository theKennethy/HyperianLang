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
cd HyperianLang
node run.js example.hl
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

# Electron Desktop Apps

Run any HyperianLang file as a desktop app:

```bash
npm install electron --save-dev
node run.js --electron app.hl
```

---

# VS Code Extension

```bash
cp -r vscode-hyperianlang ~/.vscode/extensions/hyperianlang
```

---

# Examples

See `example.hl`, `webapp.hl`, and `server.hl` for complete examples.

---

# License

MIT

---

Made with ❤️ for developers who prefer readable code.
