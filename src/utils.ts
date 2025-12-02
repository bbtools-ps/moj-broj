function createFullExpression(exprA: string, exprB: string, symbol: string) {
  const needsParensA =
    exprA.includes('+') ||
    exprA.includes('-') ||
    exprA.includes('×') ||
    exprA.includes('÷');
  const needsParensB =
    exprB.includes('+') ||
    exprB.includes('-') ||
    exprB.includes('×') ||
    exprB.includes('÷');

  const leftExpr =
    needsParensA && (symbol === '×' || symbol === '÷') ? `(${exprA})` : exprA;
  let rightExpr =
    needsParensB && (symbol === '×' || symbol === '÷') ? `(${exprB})` : exprB;

  // For subtraction and division, always use parentheses on the right if it contains operations
  if ((symbol === '-' || symbol === '÷') && needsParensB) {
    rightExpr = `(${exprB})`;
  }

  return `${leftExpr} ${symbol} ${rightExpr}`;
}

export function findSolution(nums: number[], targetNum: number) {
  // Use index-based tracking to handle duplicate numbers correctly
  const MAX_DEPTH = 6; // Limit search depth
  const PRUNE_THRESHOLD = 2; // Prune branches unlikely to improve

  const queue: [
    number[],
    Map<number, { value: number; expr: string }>,
    number,
  ][] = [
    [
      nums,
      new Map(nums.map((n, idx) => [idx, { value: n, expr: n.toString() }])),
      0, // depth
    ],
  ];
  const visited = new Set([[...nums].sort().join()]);
  const resultCache = new Map<string, number>(); // Cache intermediate results
  let closest = Infinity;
  let closestResult = 0;
  let closestSolution = '';

  const operations = [
    { fn: (a: number, b: number) => a + b, symbol: '+' },
    { fn: (a: number, b: number) => a - b, symbol: '-' },
    { fn: (a: number, b: number) => a * b, symbol: '×' },
    { fn: (a: number, b: number) => a / b, symbol: '÷' },
  ];

  if (nums.includes(targetNum)) {
    return { result: targetNum, solution: targetNum.toString() };
  }

  while (queue.length > 0) {
    const [currentNums, exprMap, depth] = queue.shift()!;

    // Depth limiting - prevent excessive exploration
    if (depth >= MAX_DEPTH) continue;

    // Generate all combinations of two numbers
    for (let i = 0; i < currentNums.length; i++) {
      for (let j = i + 1; j < currentNums.length; j++) {
        const a = currentNums[i];
        const b = currentNums[j];
        const exprA = exprMap.get(i)!.expr;
        const exprB = exprMap.get(j)!.expr;

        // Try all operations
        for (const { fn, symbol } of operations) {
          const results: { value: number; exprA: string; exprB: string }[] = [];

          // For non-commutative operations, try both orders
          if (symbol === '-' || symbol === '÷') {
            results.push({
              value: fn(a, b),
              exprA: exprA,
              exprB: exprB,
            });
            results.push({
              value: fn(b, a),
              exprA: exprB,
              exprB: exprA,
            });
          } else {
            results.push({
              value: fn(a, b),
              exprA: exprA,
              exprB: exprB,
            });
          }

          for (const { value, exprA, exprB } of results) {
            // Check validity
            if (value < 0 || !Number.isSafeInteger(value)) continue;

            const currentDiff = Math.abs(targetNum - value);

            // Prune branches that are unlikely to improve - skip values too far from target
            if (currentDiff > closest * PRUNE_THRESHOLD && closest !== Infinity)
              continue;

            // Create new number set
            const newNums = currentNums.filter(
              (_: number, idx: number) => idx !== i && idx !== j
            );
            newNums.push(value);

            const stateKey = [...newNums].sort().join();

            // Check result cache to avoid duplicate computation
            const cacheKey = `${value}-${stateKey}`;
            if (resultCache.has(cacheKey)) continue;
            resultCache.set(cacheKey, value);

            if (!visited.has(stateKey)) {
              visited.add(stateKey);

              const fullExpression = createFullExpression(exprA, exprB, symbol);

              // Create new expression map with updated indices
              const newExprMap = new Map<
                number,
                { value: number; expr: string }
              >();
              let newIdx = 0;
              for (let k = 0; k < currentNums.length; k++) {
                if (k !== i && k !== j) {
                  newExprMap.set(newIdx, exprMap.get(k)!);
                  newIdx++;
                }
              }
              newExprMap.set(newIdx, { value, expr: fullExpression });

              // Check if we found the target
              if (targetNum === value) {
                return { result: value, solution: fullExpression };
              }

              if (currentDiff < closest) {
                closest = currentDiff;
                closestResult = value;
                closestSolution = fullExpression;
              }

              // Add to queue for further exploration with incremented depth
              queue.push([newNums, newExprMap, depth + 1]);
            }
          }
        }
      }
    }
  }

  return { result: closestResult, solution: closestSolution };
}

export function generateRandomNumber(min?: number, max?: number) {
  const minValue = min ?? 0;
  const maxValue = max ?? 999;
  return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
}

export function pickRandomNumber(arr: number[]) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
