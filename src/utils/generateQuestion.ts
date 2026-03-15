import type { MathQuestion, Difficulty, Operator } from "@/types/game";

const ALL_OPERATORS: Operator[] = ['+', '-', '×', '÷'];

/** Number ranges per difficulty */
const RANGES: Record<Exclude<Difficulty, 'mixed'>, { min: number; max: number }> = {
  easy:   { min: 1,  max: 10 },
  medium: { min: 5,  max: 25 },
  hard:   { min: 10, max: 50 },
};

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickOperator(): Operator {
  return ALL_OPERATORS[Math.floor(Math.random() * ALL_OPERATORS.length)];
}

function resolveDifficulty(d: Difficulty): Exclude<Difficulty, 'mixed'> {
  if (d !== 'mixed') return d;
  const options: Exclude<Difficulty, 'mixed'>[] = ['easy', 'medium', 'hard'];
  return options[Math.floor(Math.random() * options.length)];
}

function buildQuestion(a: number, b: number, operator: Operator): MathQuestion {
  let answer: number;
  switch (operator) {
    case '+': answer = a + b; break;
    case '-': answer = a - b; break;
    case '×': answer = a * b; break;
    case '÷': answer = a / b; break;
  }

  return {
    a,
    b,
    operator,
    answer,
    display: `${a} ${operator} ${b}`,
  };
}

export function generateQuestion(
  difficulty: Difficulty = 'easy',
  operator?: Operator,
): MathQuestion {
  const resolved = resolveDifficulty(difficulty);
  const { min, max } = RANGES[resolved];
  const op = operator ?? pickOperator();

  switch (op) {
    case '+': {
      return buildQuestion(rand(min, max), rand(min, max), '+');
    }

    case '-': {
      // Ensure non-negative result: a >= b
      const a = rand(min, max);
      const b = rand(min, a);
      return buildQuestion(a, b, '-');
    }

    case '×': {
      // Keep multipliers smaller so answers stay reasonable
      const capA = Math.min(max, 12);
      const capB = Math.min(max, 12);
      return buildQuestion(rand(Math.max(min, 1), capA), rand(Math.max(min, 1), capB), '×');
    }

    case '÷': {
      // Generate a clean division: pick divisor and quotient, then a = divisor × quotient
      const divisor  = rand(Math.max(min, 1), Math.min(max, 12));
      const quotient = rand(1, Math.min(max, 10));
      return buildQuestion(divisor * quotient, divisor, '÷');
    }
  }
}
