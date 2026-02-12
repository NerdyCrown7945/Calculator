import { create, all, MathJsInstance } from 'mathjs';

export interface EvalResult {
  output: string;
  error?: string;
}

export class MathEngine {
  private readonly math: MathJsInstance;
  private readonly scope: Record<string, unknown>;
  private angleMode: 'rad' | 'deg';

  constructor() {
    this.math = create(all);
    this.scope = { pi: Math.PI, e: Math.E };
    this.angleMode = 'rad';
  }

  setAngleMode(mode: 'rad' | 'deg'): void {
    this.angleMode = mode;
  }

  getScope(): Record<string, unknown> {
    return { ...this.scope };
  }

  evaluate(expression: string): EvalResult {
    const trimmed = expression.trim();
    if (!trimmed) return { output: '' };

    try {
      const result = this.math.evaluate(this.sanitize(trimmed), this.scope);
      return { output: typeof result === 'string' ? result : this.math.format(result, { precision: 14 }) };
    } catch (error) {
      return { output: '', error: this.humanizeError(error) };
    }
  }

  evaluateWithX(expression: string, x: number): number {
    const exprScope = { ...this.scope, x };
    const result = this.math.evaluate(this.sanitize(expression), exprScope);
    return typeof result === 'number' ? result : Number(result);
  }

  private sanitize(expr: string): string {
    if (this.angleMode === 'rad') return expr;
    const trigFunctions = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan'];
    let transformed = expr;
    for (const fn of trigFunctions) {
      transformed = transformed.replace(new RegExp(`${fn}\\(([^)]+)\\)`, 'g'), `${fn}(($1) * pi / 180)`);
    }
    return transformed;
  }

  private humanizeError(error: unknown): string {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message.includes('Undefined symbol')) return '정의되지 않은 변수 또는 함수입니다.';
    if (message.includes('divide by zero')) return '0으로 나눌 수 없습니다.';
    return message;
  }
}
