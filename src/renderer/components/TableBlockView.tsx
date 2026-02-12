import { TableBlock } from '../../shared/types';
import { MathEngine } from '../lib/mathEngine';
import { useWorkspaceStore } from '../store';

export function TableBlockView({ block, engine }: { block: TableBlock; engine: MathEngine }): JSX.Element {
  const { updateBlock } = useWorkspaceStore();

  const regenerate = (): void => {
    const rows: Array<{ x: number; y: number | string }> = [];
    for (let x = block.xStart; x <= block.xEnd + 1e-9; x += block.step) {
      try {
        rows.push({ x, y: engine.evaluateWithX(block.expression, Number(x.toFixed(10))) });
      } catch (error) {
        rows.push({ x, y: error instanceof Error ? error.message : '계산 실패' });
      }
    }
    updateBlock(block.id, (current) => (current.type === 'table' ? { ...current, rows } : current));
  };

  const exportCSV = async (): Promise<void> => {
    const csv = ['x,y', ...block.rows.map((row) => `${row.x},${row.y}`)].join('\n');
    await window.workspaceAPI.exportCSV({ defaultName: `${block.title || 'table'}.csv`, content: csv });
  };

  return (
    <div>
      <h3>{block.title}</h3>
      <div className="grid4">
        <label>
          f(x)
          <input
            value={block.expression}
            onChange={(e) =>
              updateBlock(block.id, (current) => (current.type === 'table' ? { ...current, expression: e.target.value } : current))
            }
          />
        </label>
        <label>
          xStart
          <input
            type="number"
            value={block.xStart}
            onChange={(e) =>
              updateBlock(block.id, (current) =>
                current.type === 'table' ? { ...current, xStart: Number(e.target.value) } : current
              )
            }
          />
        </label>
        <label>
          xEnd
          <input
            type="number"
            value={block.xEnd}
            onChange={(e) =>
              updateBlock(block.id, (current) =>
                current.type === 'table' ? { ...current, xEnd: Number(e.target.value) } : current
              )
            }
          />
        </label>
        <label>
          step
          <input
            type="number"
            value={block.step}
            onChange={(e) =>
              updateBlock(block.id, (current) =>
                current.type === 'table' ? { ...current, step: Number(e.target.value) } : current
              )
            }
          />
        </label>
      </div>
      <button onClick={regenerate}>Generate Table</button>
      <button onClick={() => void exportCSV()}>Export CSV</button>
      <table>
        <thead>
          <tr>
            <th>x</th>
            <th>y</th>
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, idx) => (
            <tr key={idx}>
              <td>{row.x}</td>
              <td>{row.y}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
