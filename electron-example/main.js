const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

// Load HyperianLang
const corePath = path.join(__dirname, '..', 'core.js');
const { HyperianLang } = require(corePath);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#667eea'
  });

  // Load the HyperianLang app which starts a server on port 3001
  const hlCode = fs.readFileSync(path.join(__dirname, 'app.hl'), 'utf-8');
  const hl = new HyperianLang();
  
  // Run HyperianLang (starts the server)
  console.log('Starting HyperianLang server...');
  hl.run(hlCode);
  
  // Give the server a moment to start, then load the page
  setTimeout(() => {
    console.log('Loading http://localhost:3001');
    mainWindow.loadURL('http://localhost:3001');
  }, 1500);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
