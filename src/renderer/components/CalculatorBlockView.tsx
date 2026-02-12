import { KeyboardEvent, useState } from 'react';
import { CalculatorBlock } from '../../shared/types';
import { MathEngine } from '../lib/mathEngine';
import { useWorkspaceStore } from '../store';

export function CalculatorBlockView({ block, engine }: { block: CalculatorBlock; engine: MathEngine }): JSX.Element {
  const { updateBlock, pushHistoryInput, prevHistoryInput, nextHistoryInput } = useWorkspaceStore();
  const [input, setInput] = useState(block.currentInput ?? '');

  const run = (): void => {
    const expr = input.trim();
    if (!expr) return;
    const result = engine.evaluate(expr);
    pushHistoryInput(expr);
    updateBlock(block.id, (current) => {
      if (current.type !== 'calculator') return current;
      return {
        ...current,
        currentInput: '',
        history: [
          ...current.history,
          {
            input: expr,
            output: result.error ?? result.output,
            isError: Boolean(result.error)
          }
        ]
      };
    });
    setInput('');
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') run();
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setInput(prevHistoryInput());
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setInput(nextHistoryInput());
    }
  };

  return (
    <div>
      <h3>{block.title}</h3>
      <input
        className="line-input"
        placeholder="예: a=3, sin(a), 2+2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <button onClick={run}>Execute</button>
      <div className="history">
        {block.history.map((entry, idx) => (
          <div key={idx} className={entry.isError ? 'error' : ''}>
            <div>&gt; {entry.input}</div>
            <div>{entry.output}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
