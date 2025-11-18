import { GridState, SimulationParams } from '../types';

// Cache for GPF calculations to improve performance
const gpfCache = new Map<number, number>();
// Cache for Factorization strings
const factorizationCache = new Map<number, string>();

const SUPERSCRIPTS: { [key: string]: string } = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
};

const toSuperscript = (n: number): string => {
  return n.toString().split('').map(c => SUPERSCRIPTS[c] || c).join('');
};

/**
 * Calculates the Greatest Prime Factor of a number.
 * Treating gpf(1) = 1 as per requirements.
 */
export const getGPF = (n: number): number => {
  if (n <= 1) return 1;
  if (gpfCache.has(n)) return gpfCache.get(n)!;

  let number = n;
  let maxPrime = -1;

  // Divide by 2 to remove all even factors
  while (number % 2 === 0) {
    maxPrime = 2;
    number >>= 1;
  }

  // Divide by odd numbers
  for (let i = 3; i <= Math.sqrt(number); i += 2) {
    while (number % i === 0) {
      maxPrime = i;
      number = number / i;
    }
  }

  // If number > 2, then the remaining number is a prime
  if (number > 2) {
    maxPrime = number;
  }

  gpfCache.set(n, maxPrime);
  return maxPrime;
};

/**
 * Check if a number is prime.
 */
export const isPrime = (n: number): boolean => {
  if (n <= 1) return false;
  // For n > 1, if GPF(n) == n, it is prime
  return getGPF(n) === n;
};

/**
 * Returns a clean prime factorization string (e.g., "2³·3").
 */
export const getPrimeFactorization = (n: number): string => {
  if (n < 1) return n.toString();
  if (n === 1) return "1";
  if (factorizationCache.has(n)) return factorizationCache.get(n)!;

  let temp = n;
  const factors: { p: number; e: number }[] = [];
  
  // Factor out 2
  if (temp % 2 === 0) {
    let count = 0;
    while (temp % 2 === 0) {
      count++;
      temp /= 2;
    }
    factors.push({ p: 2, e: count });
  }

  // Factor odd numbers
  for (let i = 3; i * i <= temp; i += 2) {
    if (temp % i === 0) {
      let count = 0;
      while (temp % i === 0) {
        count++;
        temp /= i;
      }
      factors.push({ p: i, e: count });
    }
  }

  if (temp > 1) {
    factors.push({ p: temp, e: 1 });
  }

  const result = factors.map(f => {
    if (f.e === 1) return f.p.toString();
    return `${f.p}${toSuperscript(f.e)}`;
  }).join('·');

  factorizationCache.set(n, result);
  return result;
};

/**
 * Generates the grid based on Factor Pushing logic.
 */
export const generateSimulation = (params: SimulationParams): GridState => {
  const { count, startValue, step, maxRows } = params;
  
  // Initialize first row
  // Row 0: Linear function
  const firstRow: number[] = Array.from({ length: count }, (_, i) => startValue + (i * step));
  
  const rows: number[][] = [firstRow];
  let currentMin = Math.min(...firstRow);
  let currentMax = Math.max(...firstRow);

  for (let t = 0; t < maxRows - 1; t++) {
    const prevRow = rows[t];
    const newRow = new Array(count);
    
    for (let i = 0; i < count; i++) {
      // Cyclic boundary: index - 1 wraps to end
      const prevIndex = (i - 1 + count) % count;
      
      const currentVal = prevRow[i];
      const neighborVal = prevRow[prevIndex];
      
      // Transition Rule: current - gpf(current) + gpf(neighbor)
      const nextVal = currentVal - getGPF(currentVal) + getGPF(neighborVal);
      
      newRow[i] = nextVal;
      
      // Track min/max for heatmaps
      if (nextVal < currentMin) currentMin = nextVal;
      if (nextVal > currentMax) currentMax = nextVal;
    }
    
    rows.push(newRow);
  }

  return {
    rows,
    minVal: currentMin,
    maxVal: currentMax,
  };
};

export const calculateRowSum = (row: number[]): number => {
  return row.reduce((acc, val) => acc + val, 0);
};