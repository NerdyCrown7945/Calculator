import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';

let win: BrowserWindow | null = null;

const createWindow = async (): Promise<void> => {
  win = new BrowserWindow({
    width: 1300,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    await win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    await win.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
};

app.whenReady().then(createWindow);

ipcMain.handle('workspace:open', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Workspace JSON', extensions: ['json'] }]
  });
  if (result.canceled || !result.filePaths[0]) return null;
  const filePath = result.filePaths[0];
  const content = await fs.readFile(filePath, 'utf8');
  return { filePath, content };
});

ipcMain.handle('workspace:save', async (_, payload: { content: string; filePath?: string }) => {
  let target = payload.filePath;
  if (!target) {
    const result = await dialog.showSaveDialog({ filters: [{ name: 'Workspace JSON', extensions: ['json'] }] });
    if (result.canceled || !result.filePath) return null;
    target = result.filePath;
  }
  await fs.writeFile(target, payload.content, 'utf8');
  return { filePath: target };
});

ipcMain.handle('workspace:export-csv', async (_, payload: { defaultName: string; content: string }) => {
  const result = await dialog.showSaveDialog({
    defaultPath: payload.defaultName,
    filters: [{ name: 'CSV', extensions: ['csv'] }]
  });
  if (result.canceled || !result.filePath) return null;
  await fs.writeFile(result.filePath, payload.content, 'utf8');
  return { filePath: result.filePath };
});
