import { create } from 'zustand';
import { createEmptyDocument, deserializeDocument, serializeDocument } from '../shared/document';
import { WorkspaceBlock, WorkspaceDocument } from '../shared/types';
import { createBlock } from './lib/blockFactory';

interface WorkspaceState {
  doc: WorkspaceDocument;
  selectedBlockId?: string;
  filePath?: string;
  recentInputs: string[];
  historyCursor: number;
  setDocument: (doc: WorkspaceDocument, filePath?: string) => void;
  newDocument: () => void;
  addBlock: (type: WorkspaceBlock['type']) => void;
  updateBlock: (id: string, updater: (block: WorkspaceBlock) => WorkspaceBlock) => void;
  selectBlock: (id?: string) => void;
  setAngleMode: (mode: 'rad' | 'deg') => void;
  pushHistoryInput: (input: string) => void;
  prevHistoryInput: () => string;
  nextHistoryInput: () => string;
  exportSerialized: () => string;
  importSerialized: (raw: string, filePath?: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  doc: createEmptyDocument(),
  recentInputs: [],
  historyCursor: -1,
  setDocument: (doc, filePath) => set({ doc, filePath }),
  newDocument: () => set({ doc: createEmptyDocument(), selectedBlockId: undefined, filePath: undefined }),
  addBlock: (type) => {
    const block = createBlock(type);
    set((state) => ({
      doc: { ...state.doc, blocks: [...state.doc.blocks, block] },
      selectedBlockId: block.id
    }));
  },
  updateBlock: (id, updater) => {
    set((state) => ({
      doc: {
        ...state.doc,
        blocks: state.doc.blocks.map((b) => (b.id === id ? updater(b) : b)),
        metadata: { ...state.doc.metadata, updatedAt: new Date().toISOString() }
      }
    }));
  },
  selectBlock: (id) => set({ selectedBlockId: id }),
  setAngleMode: (mode) => set((state) => ({ doc: { ...state.doc, settings: { ...state.doc.settings, angleMode: mode } } })),
  pushHistoryInput: (input) =>
    set((state) => ({ recentInputs: [input, ...state.recentInputs].slice(0, 100), historyCursor: -1 })),
  prevHistoryInput: () => {
    const { recentInputs, historyCursor } = get();
    const next = Math.min(historyCursor + 1, recentInputs.length - 1);
    set({ historyCursor: next });
    return recentInputs[next] ?? '';
  },
  nextHistoryInput: () => {
    const { recentInputs, historyCursor } = get();
    const next = Math.max(historyCursor - 1, -1);
    set({ historyCursor: next });
    return next === -1 ? '' : (recentInputs[next] ?? '');
  },
  exportSerialized: () => serializeDocument(get().doc),
  importSerialized: (raw, filePath) => set({ doc: deserializeDocument(raw), filePath })
}));
