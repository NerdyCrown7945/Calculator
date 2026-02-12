import { describe, expect, it } from 'vitest';
import { evaluateCAS } from '../src/renderer/lib/casEngine';

describe('cas engine', () => {
  it('supports derivative', () => {
    const result = evaluateCAS('derivative(x^3, x)');
    expect(result.output).toContain('3*x^2');
  });

  it('returns limitation message for unsupported syntax', () => {
    const result = evaluateCAS('sum(x,1,10)');
    expect(result.error).toContain('현재 엔진 제한');
  });
});
