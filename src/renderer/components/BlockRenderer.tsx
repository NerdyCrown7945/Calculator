import { MathEngine } from '../lib/mathEngine';
import { WorkspaceBlock } from '../../shared/types';
import { CalculatorBlockView } from './CalculatorBlockView';
import { CASBlockView } from './CASBlockView';
import { GraphBlockView } from './GraphBlockView';
import { NotesBlockView } from './NotesBlockView';
import { TableBlockView } from './TableBlockView';

export function BlockRenderer({ block, engine }: { block: WorkspaceBlock; engine: MathEngine }): JSX.Element {
  switch (block.type) {
    case 'calculator':
      return <CalculatorBlockView block={block} engine={engine} />;
    case 'notes':
      return <NotesBlockView block={block} />;
    case 'graph':
      return <GraphBlockView block={block} engine={engine} />;
    case 'cas':
      return <CASBlockView block={block} />;
    case 'table':
      return <TableBlockView block={block} engine={engine} />;
    default:
      return <div>알 수 없는 블록 타입</div>;
  }
}
