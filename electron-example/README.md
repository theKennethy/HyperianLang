# HyperianLang Electron Example

A desktop app written **100% in HyperianLang** — no JavaScript code needed!

## Files

```
electron-example/
├── app.hl          # Your entire app in HyperianLang
├── main.js         # Minimal Electron loader (just runs app.hl)
└── package.json
```

## The app.hl file does everything:

- Defines variables and data
- Generates HTML dynamically
- Handles HTTP routes
- Processes form submissions
- Server-side rendering

## Run it

```bash
cd electron-example
npm start
```

## How it works

1. `main.js` loads `app.hl` and runs it through HyperianLang
2. `app.hl` starts an HTTP server on port 3000
3. Electron window loads from `http://localhost:3000`
4. All pages are rendered by HyperianLang using `send html`

## No JavaScript required!

All logic is in HyperianLang:
- HTML generation: `set html to "<!DOCTYPE html>..."`
- Functions: `define function renderPage ... end`
- Loops: `for each todo in todos do ... end`
- Conditionals: `if todoDone equals true then ... end`
- HTTP handling: `when the server receives a "GET" request to "/" then ... end`
