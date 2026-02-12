import { KeyboardEvent, useState } from 'react';
import { CASBlock } from '../../shared/types';
import { useWorkspaceStore } from '../store';
import { evaluateCAS } from '../lib/casEngine';

export function CASBlockView({ block }: { block: CASBlock }): JSX.Element {
  const { updateBlock, pushHistoryInput, prevHistoryInput, nextHistoryInput } = useWorkspaceStore();
  const [input, setInput] = useState(block.currentInput ?? '');

  const run = (): void => {
    const expr = input.trim();
    if (!expr) return;
    const result = evaluateCAS(expr);
    pushHistoryInput(expr);
    updateBlock(block.id, (current) => {
      if (current.type !== 'cas') return current;
      return {
        ...current,
        currentInput: '',
        history: [...current.history, { input: expr, output: result.error ?? result.output, isError: Boolean(result.error) }]
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
      <p>지원 명령: simplify, factor, expand, solve, derivative, integral</p>
      <input className="line-input" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKeyDown} />
      <button onClick={run}>Execute CAS</button>
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
