import { WorkspaceDocument } from './types';

export const CURRENT_DOC_VERSION = 1;

export function createEmptyDocument(title = 'Untitled Workspace'): WorkspaceDocument {
  const now = new Date().toISOString();
  return {
    version: 1,
    metadata: {
      title,
      createdAt: now,
      updatedAt: now
    },
    settings: {
      angleMode: 'rad'
    },
    blocks: []
  };
}

export function serializeDocument(doc: WorkspaceDocument): string {
  return JSON.stringify({ ...doc, metadata: { ...doc.metadata, updatedAt: new Date().toISOString() } }, null, 2);
}

export function deserializeDocument(raw: string): WorkspaceDocument {
  const parsed = JSON.parse(raw) as WorkspaceDocument;
  if (parsed.version !== CURRENT_DOC_VERSION) {
    throw new Error(`Unsupported document version: ${parsed.version}`);
  }
  return parsed;
}
