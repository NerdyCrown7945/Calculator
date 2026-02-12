export {};

declare global {
  interface Window {
    workspaceAPI: {
      openDocument: () => Promise<{ filePath: string; content: string } | null>;
      saveDocument: (payload: { content: string; filePath?: string }) => Promise<{ filePath: string } | null>;
      exportCSV: (payload: { defaultName: string; content: string }) => Promise<{ filePath: string } | null>;
    };
  }
}
