import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Controls } from './components/Controls';
import { Grid } from './components/Grid';
import { SimulationParams, ViewSettings } from './types';
import { generateSimulation } from './utils/math';

// Simple helper component to render LaTeX using KaTeX
const Latex: React.FC<{ formula: string }> = ({ formula }) => {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (spanRef.current && (window as any).katex) {
      (window as any).katex.render(formula, spanRef.current, {
        throwOnError: false,
      });
    }
  }, [formula]);

  return <span ref={spanRef} />;
};

const App: React.FC = () => {
  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Simulation Parameters State
  const [params, setParams] = useState<SimulationParams>({
    count: 20,
    startValue: 1,
    step: 1,
    maxRows: 30,
  });

  // View Settings State
  const [viewSettings, setViewSettings] = useState<ViewSettings>({
    isModuloMode: false,
    modulus: 5,
  });

  // Memoize simulation result to prevent unnecessary recalculations
  const gridState = useMemo(() => {
    return generateSimulation(params);
  }, [params]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-200 transition-colors duration-200 flex flex-col">
      <div className="container mx-auto px-4 py-6 max-w-7xl flex flex-col h-screen">
        
        {/* Header */}
        <header className="mb-6 flex justify-between items-start flex-shrink-0">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Factor Pushing
              </span>{' '}
              Automaton
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-2xl flex items-center gap-2">
              Rule: <Latex formula="x_i' = x_i - \text{gpf}(x_i) + \text{gpf}(x_{i-1})" />
            </p>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              // Sun Icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              // Moon Icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </header>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
          
          {/* Controls Sidebar */}
          <section className="flex-shrink-0 lg:w-80 overflow-y-auto custom-scrollbar pr-2">
            <Controls 
              params={params}
              setParams={setParams}
              viewSettings={viewSettings}
              setViewSettings={setViewSettings}
            />
          </section>

          {/* Grid Visualization Section */}
          <main className="flex-1 min-h-0 flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 transition-colors duration-200">
            <Grid gridState={gridState} viewSettings={viewSettings} />
          </main>

        </div>

      </div>
    </div>
  );
};

export default App;