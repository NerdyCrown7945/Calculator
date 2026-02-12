import { describe, expect, it } from 'vitest';
import { MathEngine } from '../src/renderer/lib/mathEngine';

describe('math engine', () => {
  it('evaluates arithmetic', () => {
    const engine = new MathEngine();
    expect(engine.evaluate('2+3').output).toBe('5');
  });

  it('stores variable in shared scope', () => {
    const engine = new MathEngine();
    engine.evaluate('a=3');
    expect(engine.evaluate('a*2').output).toBe('6');
  });

  it('evaluates expression with x', () => {
    const engine = new MathEngine();
    expect(engine.evaluateWithX('x^2+1', 2)).toBe(5);
  });
});
