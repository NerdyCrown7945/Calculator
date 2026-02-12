export type BlockType = 'calculator' | 'notes' | 'graph' | 'cas' | 'table';

export interface BaseBlock {
  id: string;
  type: BlockType;
  title: string;
}

export interface HistoryEntry {
  input: string;
  output: string;
  isError?: boolean;
}

export interface CalculatorBlock extends BaseBlock {
  type: 'calculator';
  history: HistoryEntry[];
  currentInput: string;
}

export interface NotesBlock extends BaseBlock {
  type: 'notes';
  markdown: string;
}

export interface GraphFunction {
  expression: string;
  color: string;
}

export interface GraphBlock extends BaseBlock {
  type: 'graph';
  functions: GraphFunction[];
  range: { xMin: number; xMax: number; yMin: number; yMax: number };
}

export interface CASBlock extends BaseBlock {
  type: 'cas';
  history: HistoryEntry[];
  currentInput: string;
}

export interface TableBlock extends BaseBlock {
  type: 'table';
  expression: string;
  xStart: number;
  xEnd: number;
  step: number;
  rows: Array<{ x: number; y: number | string }>;
}

export type WorkspaceBlock = CalculatorBlock | NotesBlock | GraphBlock | CASBlock | TableBlock;

export interface WorkspaceDocument {
  version: 1;
  metadata: {
    title: string;
    createdAt: string;
    updatedAt: string;
  };
  settings: {
    angleMode: 'rad' | 'deg';
  };
  blocks: WorkspaceBlock[];
}
