import Plotly from 'plotly.js-dist-min';
import { useEffect, useMemo, useRef, useState } from 'react';
import { GraphBlock } from '../../shared/types';
import { MathEngine } from '../lib/mathEngine';
import { useWorkspaceStore } from '../store';

const COLORS = ['#1f77b4', '#d62728', '#2ca02c'];

export function GraphBlockView({ block, engine }: { block: GraphBlock; engine: MathEngine }): JSX.Element {
  const plotRef = useRef<HTMLDivElement | null>(null);
  const { updateBlock } = useWorkspaceStore();
  const [graphError, setGraphError] = useState<string>('');

  const traces = useMemo(() => {
    const points = 300;
    const xValues = Array.from(
      { length: points },
      (_, i) => block.range.xMin + ((block.range.xMax - block.range.xMin) * i) / (points - 1)
    );

    try {
      const mapped = block.functions.slice(0, 3).map((fn, index) => {
        const y = xValues.map((x) => engine.evaluateWithX(fn.expression, x));
        return { x: xValues, y, type: 'scatter', mode: 'lines', name: fn.expression, line: { color: fn.color || COLORS[index] } };
      });
      setGraphError('');
      return mapped;
    } catch (error) {
      setGraphError(error instanceof Error ? error.message : '그래프 계산 실패');
      return [];
    }
  }, [block.functions, block.range, engine]);

  useEffect(() => {
    if (!plotRef.current) return;
    void Plotly.newPlot(plotRef.current, traces as never[], {
      margin: { l: 40, r: 20, t: 20, b: 40 },
      xaxis: { range: [block.range.xMin, block.range.xMax], title: 'x' },
      yaxis: { range: [block.range.yMin, block.range.yMax], title: 'y' },
      hovermode: 'closest'
    });
  }, [traces, block.range]);

  return (
    <div>
      <h3>{block.title}</h3>
      <div className="grid3">
        {block.functions.slice(0, 3).map((fn, idx) => (
          <input
            key={idx}
            value={fn.expression}
            onChange={(e) =>
              updateBlock(block.id, (current) =>
                current.type === 'graph'
                  ? {
                      ...current,
                      functions: current.functions.map((it, i) =>
                        i === idx ? { ...it, expression: e.target.value, color: COLORS[i] } : it
                      )
                    }
                  : current
              )
            }
            placeholder={`y${idx + 1}=f(x)`}
          />
        ))}
      </div>
      <div className="grid4">
        {(['xMin', 'xMax', 'yMin', 'yMax'] as const).map((key) => (
          <label key={key}>
            {key}
            <input
              type="number"
              value={block.range[key]}
              onChange={(e) =>
                updateBlock(block.id, (current) =>
                  current.type === 'graph'
                    ? { ...current, range: { ...current.range, [key]: Number(e.target.value) } }
                    : current
                )
              }
            />
          </label>
        ))}
      </div>
      {graphError && <p className="error">{graphError}</p>}
      <div ref={plotRef} style={{ width: '100%', height: 420 }} />
    </div>
  );
}
