const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

// Un solo icono para todas las plataformas (electron-builder genera .icns/.ico)
const ICON = path.join(__dirname, '..', 'assets', 'icons', 'icon.png');

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 960,
    minHeight: 640,
    title: 'Plannerfy',
    icon: ICON,
    backgroundColor: '#F5EFE6',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // localStorage persiste en app.getPath('userData') automáticamente
    },
  });

  win.loadFile(path.join(__dirname, '..', 'out', 'plannerfy.html'));

  // Sin barra de menú nativa
  Menu.setApplicationMenu(null);

  // Abrir links externos en el navegador del sistema
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
