export interface MathQuestion {
  a: number;
  b: number;
  answer: number;
  display: string;
}

export function generateQuestion(difficulty: number = 1): MathQuestion {
  let a: number;
  let b: number;

  switch (difficulty) {
    case 1:
      a = Math.floor(Math.random() * 10) + 1;
      b = Math.floor(Math.random() * 10) + 1;
      break;
    case 2:
      a = Math.floor(Math.random() * 20) + 5;
      b = Math.floor(Math.random() * 20) + 5;
      break;
    case 3:
      a = Math.floor(Math.random() * 50) + 10;
      b = Math.floor(Math.random() * 50) + 10;
      break;
    default:
      a = Math.floor(Math.random() * 10) + 1;
      b = Math.floor(Math.random() * 10) + 1;
  }

  return {
    a,
    b,
    answer: a + b,
    display: `${a} + ${b}`,
  };
}
