#!/usr/bin/env node
'use strict';
// ═══════════════════════════════════════════════════════════════════════════
// HyperianLang CLI — run a .hl file from the command line
//
//   Usage: node run.js <file.hl> [--event <eventKey>]
//   or     hl <file.hl>            (after `npm link` or global install)
//
//   Examples:
//     node run.js game.hl
//     node run.js game.hl --event starts:game
//     node run.js game.hl --event player:levelup
// ═══════════════════════════════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');
const { HyperianLang } = require('./core');
const { HLRuntime }    = require('./runtime');

// ── parse arguments ────────────────────────────────────────────────────────
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  console.log([
    'HyperianLang CLI',
    '',
    'Usage:',
    '  node run.js <file.hl> [--event <eventKey>]',
    '  node run.js --electron <file.hl>',
    '',
    'Options:',
    '  --electron      Run as an Electron desktop app',
    '  --event <key>   Event to trigger after loading (default: starts:game)',
    '  --parse         Print the parsed AST and exit without running',
    '  --version       Print the HyperianLang version',
    '  --help          Show this help',
    '',
    'Examples:',
    '  node run.js main.hl',
    '  node run.js main.hl --event player:levelup',
    '  node run.js main.hl --parse',
    '  node run.js --electron app.hl',
  ].join('\n'));
  process.exit(0);
}

if (args[0] === '--version' || args[0] === '-v') {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  console.log('HyperianLang v' + pkg.version);
  process.exit(0);
}

// ── Electron mode ───────────────────────────────────────────────────────────
if (args[0] === '--electron') {
  const hlFile = args[1];
  if (!hlFile) {
    console.error('Error: --electron requires a .hl file');
    console.error('Usage: node run.js --electron <file.hl>');
    process.exit(1);
  }
  
  const hlFilePath = path.resolve(hlFile);
  if (!fs.existsSync(hlFilePath)) {
    console.error(`Error: file not found: ${hlFilePath}`);
    process.exit(1);
  }
  
  // Try to find electron
  let electronPath;
  try {
    electronPath = require.resolve('electron');
    // Get the actual electron binary
    electronPath = require('electron');
  } catch (e) {
    console.error('Error: Electron is not installed.');
    console.error('Install it with: npm install electron --save-dev');
    process.exit(1);
  }
  
  const { spawn } = require('child_process');
  
  // Create a temporary main.js for Electron that runs the .hl file
  const tempMainContent = `
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const { HyperianLang } = require('${path.join(__dirname, 'core.js').replace(/\\/g, '\\\\')}');

let mainWindow;

app.whenReady().then(async () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Load and run the HyperianLang file
  const hlCode = fs.readFileSync('${hlFilePath.replace(/\\/g, '\\\\')}', 'utf8');
  const hl = new HyperianLang();
  hl.load(hlCode);
  await hl.run();

  // Load from the HyperianLang server
  mainWindow.loadURL('http://localhost:3000');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
`;
  
  const tempMainPath = path.join(require('os').tmpdir(), `hl-electron-${Date.now()}.js`);
  fs.writeFileSync(tempMainPath, tempMainContent);
  
  console.log('Starting HyperianLang Electron app...');
  console.log(`Running: ${hlFilePath}`);
  
  const electronProcess = spawn(electronPath, [tempMainPath], {
    stdio: 'inherit',
    cwd: path.dirname(hlFilePath)
  });
  
  electronProcess.on('close', (code) => {
    // Clean up temp file
    try { fs.unlinkSync(tempMainPath); } catch (e) {}
    process.exit(code || 0);
  });
  
  return; // Don't continue to normal execution
}

const filePath   = args[0];
let   eventKey   = 'starts:game';
let   parseOnly  = false;

for (let i = 1; i < args.length; i++) {
  if (args[i] === '--event' && args[i + 1]) { eventKey = args[++i]; continue; }
  if (args[i] === '--parse') { parseOnly = true; continue; }
}

// ── read source file ────────────────────────────────────────────────────────
if (!fs.existsSync(filePath)) {
  console.error(`Error: file not found: ${filePath}`);
  process.exit(1);
}

const source = fs.readFileSync(filePath, 'utf8');

// ── parse-only mode ─────────────────────────────────────────────────────────
if (parseOnly) {
  const { HLLexer, HLParser } = require('./core');
  const tokens = new HLLexer(source).tokenize();
  const ast    = new HLParser(tokens).parse();
  console.log(JSON.stringify(ast, null, 2));
  process.exit(0);
}

// ── run ─────────────────────────────────────────────────────────────────────
const runtime = new HLRuntime();
const es      = new HyperianLang(runtime);

es.load(source);

async function main() {
  try {
    // Execute init statements (including server code)
    await es.run();
    // Trigger the event (if there are event rules)
    await es.trigger(eventKey);
  } catch (err) {
    console.error('[HyperianLang] Runtime error:', err.message);
    process.exit(1);
  }
}

main();
