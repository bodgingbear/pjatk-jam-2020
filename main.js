// eslint-disable-next-line import/no-extraneous-dependencies
const { app, BrowserWindow } = require('electron');

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Inside the Pistol Guild",
    webPreferences: {
      nodeIntegration: true,
    },
    icon: __dirname + '/public/assets/icon.png'
  });

  // and load the index.html of the app.
  win.loadFile('public/index.html');
}

app.on('ready', createWindow);
