import { CASBlock, CalculatorBlock, GraphBlock, NotesBlock, TableBlock, WorkspaceBlock } from '../../shared/types';

function id(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function createBlock(type: WorkspaceBlock['type']): WorkspaceBlock {
  switch (type) {
    case 'calculator':
      return { id: id(), type, title: 'Calculator', history: [], currentInput: '' } as CalculatorBlock;
    case 'notes':
      return { id: id(), type, title: 'Notes', markdown: '' } as NotesBlock;
    case 'graph':
      return {
        id: id(),
        type,
        title: 'Graph',
        functions: [
          { expression: 'sin(x)', color: '#1f77b4' },
          { expression: 'x^2', color: '#d62728' }
        ],
        range: { xMin: -10, xMax: 10, yMin: -10, yMax: 10 }
      } as GraphBlock;
    case 'cas':
      return { id: id(), type, title: 'CAS', history: [], currentInput: '' } as CASBlock;
    case 'table':
      return { id: id(), type, title: 'Table', expression: 'x^2', xStart: -5, xEnd: 5, step: 1, rows: [] } as TableBlock;
    default:
      throw new Error('Unsupported block type');
  }
}
