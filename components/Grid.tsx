import React from 'react';
import { GridState, ViewSettings } from '../types';
import { calculateRowSum, getPrimeFactorization, isPrime } from '../utils/math';

interface GridProps {
  gridState: GridState;
  viewSettings: ViewSettings;
}

export const Grid: React.FC<GridProps> = ({ gridState, viewSettings }) => {
  const { rows, minVal, maxVal } = gridState;
  const { isModuloMode, modulus } = viewSettings;

  // Helper to determine cell style
  const getCellStyle = (value: number): React.CSSProperties => {
    if (isModuloMode) {
      const residue = value % modulus;
      // Special Case: Divisible by m
      if (residue === 0) {
        return {
          backgroundColor: '#1e293b', // slate-800
          color: '#fff',
        };
      }
      // Generate a distinct HSL color for the residue
      const hue = (residue * 360) / modulus;
      return {
        backgroundColor: `hsl(${hue}, 70%, 90%)`,
        color: `hsl(${hue}, 80%, 30%)`,
      };
    } else {
      // Standard Heatmap
      // Normalize value between 0 and 1
      const range = maxVal - minVal || 1;
      const normalized = (value - minVal) / range;
      
      // Interpolate between light blue (slate-50) and dark blue (blue-900)
      // Simple approach: use HSL lightness
      // Lightness from 95% down to 30%
      const lightness = 95 - (normalized * 65);
      
      return {
        backgroundColor: `hsl(220, 70%, ${lightness}%)`,
        color: lightness < 60 ? '#fff' : '#1e293b',
      };
    }
  };

  // Helper to format cell text
  const formatValue = (value: number) => {
    if (isModuloMode) {
      return value % modulus;
    }
    if (isPrime(value)) {
        return value;
    }
    return getPrimeFactorization(value);
  };

  const currentSum = rows.length > 0 ? calculateRowSum(rows[rows.length - 1]) : 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-2 px-1">
         <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Range: [{minVal}, {maxVal}]
         </div>
         <div className="text-xs font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded border border-emerald-200 dark:border-emerald-800">
            Invariant Sum: {currentSum.toLocaleString()}
         </div>
      </div>

      <div className="overflow-auto flex-1 border border-slate-300 dark:border-slate-600 rounded-lg shadow-inner bg-slate-50 dark:bg-slate-900 custom-scrollbar">
        <div 
            className="grid gap-[1px] bg-slate-300 dark:bg-slate-700 p-[1px]"
            style={{
                gridTemplateColumns: `repeat(${rows[0]?.length || 1}, minmax(50px, 1fr))`
            }}
        >
          {rows.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((val, colIndex) => {
                const prime = !isModuloMode && isPrime(val);
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="aspect-square flex items-center justify-center p-0.5 text-xs md:text-sm font-mono transition-colors duration-200 overflow-hidden"
                    style={getCellStyle(val)}
                    title={`Row: ${rowIndex}, Col: ${colIndex}\nValue: ${val}\nFactors: ${getPrimeFactorization(val)}\nMod ${modulus}: ${val % modulus}`}
                  >
                    <span className={`${prime ? 'font-bold' : 'font-normal'} truncate w-full text-center`}>
                      {formatValue(val)}
                    </span>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <div className="mt-2 text-center text-[10px] text-slate-400 dark:text-slate-500">
        Rows represent time steps ($t$). Columns represent array indices ($i$).
      </div>
    </div>
  );
};