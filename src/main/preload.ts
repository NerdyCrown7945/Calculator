import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('workspaceAPI', {
  openDocument: () => ipcRenderer.invoke('workspace:open'),
  saveDocument: (payload: { content: string; filePath?: string }) => ipcRenderer.invoke('workspace:save', payload),
  exportCSV: (payload: { defaultName: string; content: string }) => ipcRenderer.invoke('workspace:export-csv', payload)
});
