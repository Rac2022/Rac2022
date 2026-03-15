import type { MathQuestion, Difficulty, Operator, QuestionConfig, QuestionRules } from "@/types/game";

const ALL_OPERATORS: Operator[] = ['+', '-', '×', '÷'];

/** Number ranges per difficulty (fallback when no rules provided) */
const RANGES: Record<Exclude<Difficulty, 'mixed'>, { min: number; max: number }> = {
  easy:   { min: 1,  max: 10 },
  medium: { min: 5,  max: 25 },
  hard:   { min: 10, max: 50 },
};

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function resolveDifficulty(d: Difficulty): Exclude<Difficulty, 'mixed'> {
  if (d !== 'mixed') return d;
  const options: Exclude<Difficulty, 'mixed'>[] = ['easy', 'medium', 'hard'];
  return pickFrom(options);
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

/** Generate a question using explicit rules */
function generateFromRules(rules: QuestionRules): MathQuestion {
  const { minNumber, maxNumber, allowedOperators, allowRegrouping, allowNegatives } = rules;
  const op = pickFrom(allowedOperators);

  switch (op) {
    case '+': {
      if (!allowRegrouping) {
        // Keep sums within maxNumber to avoid large carry results
        const a = rand(minNumber, maxNumber);
        const b = rand(minNumber, Math.min(maxNumber, maxNumber - a + minNumber));
        return buildQuestion(a, Math.max(minNumber, b), '+');
      }
      return buildQuestion(rand(minNumber, maxNumber), rand(minNumber, maxNumber), '+');
    }

    case '-': {
      if (allowNegatives) {
        return buildQuestion(rand(minNumber, maxNumber), rand(minNumber, maxNumber), '-');
      }
      // Non-negative: a >= b
      const a = rand(minNumber, maxNumber);
      const b = rand(minNumber, a);
      if (!allowRegrouping) {
        // Simple subtraction: no borrowing needed (a - b stays straightforward)
        return buildQuestion(a, rand(minNumber, Math.min(a, Math.floor(a / 2) + minNumber)), '-');
      }
      return buildQuestion(a, b, '-');
    }

    case '×': {
      const capA = Math.min(maxNumber, 12);
      const capB = Math.min(maxNumber, 12);
      return buildQuestion(
        rand(Math.max(minNumber, 1), capA),
        rand(Math.max(minNumber, 1), capB),
        '×'
      );
    }

    case '÷': {
      // Always produce whole-number division
      const divisor = rand(Math.max(minNumber, 1), Math.min(maxNumber, 12));
      const quotient = rand(1, Math.min(maxNumber, 10));
      return buildQuestion(divisor * quotient, divisor, '÷');
    }
  }
}

/** Generate a question from difficulty/operator fallback */
function generateFromDifficulty(difficulty: Difficulty, operatorMode: Operator | 'mixed'): MathQuestion {
  const resolved = resolveDifficulty(difficulty);
  const { min, max } = RANGES[resolved];
  const op = operatorMode === 'mixed' ? pickFrom(ALL_OPERATORS) : operatorMode;

  switch (op) {
    case '+':
      return buildQuestion(rand(min, max), rand(min, max), '+');

    case '-': {
      const a = rand(min, max);
      const b = rand(min, a);
      return buildQuestion(a, b, '-');
    }

    case '×': {
      const capA = Math.min(max, 12);
      const capB = Math.min(max, 12);
      return buildQuestion(rand(Math.max(min, 1), capA), rand(Math.max(min, 1), capB), '×');
    }

    case '÷': {
      const divisor  = rand(Math.max(min, 1), Math.min(max, 12));
      const quotient = rand(1, Math.min(max, 10));
      return buildQuestion(divisor * quotient, divisor, '÷');
    }
  }
}

export function generateQuestion(config: QuestionConfig = {}): MathQuestion {
  const { difficulty = 'easy', operatorMode = 'mixed', rules } = config;

  if (rules) {
    return generateFromRules(rules);
  }

  return generateFromDifficulty(difficulty, operatorMode);
}
