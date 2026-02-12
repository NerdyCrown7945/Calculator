import nerdamer from 'nerdamer';
import 'nerdamer/Algebra';
import 'nerdamer/Calculus';
import 'nerdamer/Solve';

export function evaluateCAS(input: string): { output: string; error?: string } {
  const expr = input.trim();
  if (!expr) return { output: '' };

  const simplifyMatch = expr.match(/^simplify\((.+)\)$/i);
  const factorMatch = expr.match(/^factor\((.+)\)$/i);
  const expandMatch = expr.match(/^expand\((.+)\)$/i);
  const solveMatch = expr.match(/^solve\((.+),\s*([a-zA-Z]\w*)\)$/i);
  const derivativeMatch = expr.match(/^derivative\((.+),\s*([a-zA-Z]\w*)\)$/i);
  const integralMatch = expr.match(/^integral\((.+),\s*([a-zA-Z]\w*)\)$/i);

  try {
    if (simplifyMatch) return { output: nerdamer(simplifyMatch[1]).expand().toString() };
    if (factorMatch) return { output: nerdamer(`factor(${factorMatch[1]})`).toString() };
    if (expandMatch) return { output: nerdamer(`expand(${expandMatch[1]})`).toString() };
    if (solveMatch) return { output: nerdamer.solveEquations(solveMatch[1], solveMatch[2]).toString() };
    if (derivativeMatch)
      return { output: nerdamer(`diff(${derivativeMatch[1]}, ${derivativeMatch[2]})`).toString() };
    if (integralMatch)
      return { output: nerdamer(`integrate(${integralMatch[1]}, ${integralMatch[2]})`).toString() };

    return {
      output: '',
      error:
        '현재 엔진 제한: simplify(...), factor(...), expand(...), solve(expr, x), derivative(expr, x), integral(expr, x) 형태만 지원합니다.'
    };
  } catch (error) {
    return {
      output: '',
      error: error instanceof Error ? error.message : 'CAS 계산 오류'
    };
  }
}
