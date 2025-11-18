import React from 'react';
import { SimulationParams, ViewSettings } from '../types';

interface ControlsProps {
  params: SimulationParams;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  viewSettings: ViewSettings;
  setViewSettings: React.Dispatch<React.SetStateAction<ViewSettings>>;
}

export const Controls: React.FC<ControlsProps> = ({
  params,
  setParams,
  viewSettings,
  setViewSettings,
}) => {
  
  const handleChange = (field: keyof SimulationParams, value: string) => {
    const numVal = parseInt(value, 10);
    if (!isNaN(numVal)) {
      setParams(prev => ({ ...prev, [field]: numVal }));
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 space-y-6 transition-colors duration-200 h-full">
      
      {/* Simulation Configuration */}
      <div>
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Initial Parameters</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-1 gap-4">
          <div className="flex flex-col">
            <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">Count (N)</label>
            <input
              type="number"
              min="3"
              max="100"
              value={params.count}
              onChange={(e) => handleChange('count', e.target.value)}
              className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-colors duration-200"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">Start Value</label>
            <input
              type="number"
              min="1"
              value={params.startValue}
              onChange={(e) => handleChange('startValue', e.target.value)}
              className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-colors duration-200"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">Step</label>
            <input
              type="number"
              min="1"
              value={params.step}
              onChange={(e) => handleChange('step', e.target.value)}
              className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-colors duration-200"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">Max Rows</label>
            <input
              type="number"
              min="5"
              max="200"
              value={params.maxRows}
              onChange={(e) => handleChange('maxRows', e.target.value)}
              className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-colors duration-200"
            />
          </div>
        </div>
      </div>

      <hr className="border-slate-100 dark:border-slate-700" />

      {/* Visualization Settings */}
      <div className="flex flex-col md:flex-row lg:flex-col md:items-center lg:items-stretch justify-between gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-2">View Mode</h3>
           <button
            onClick={() => setViewSettings(prev => ({ ...prev, isModuloMode: !prev.isModuloMode }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${viewSettings.isModuloMode ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-600'}`}
          >
            <span className="sr-only">Enable Modulo View</span>
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${viewSettings.isModuloMode ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
          <span className={`text-sm font-medium ${viewSettings.isModuloMode ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'}`}>
            {viewSettings.isModuloMode ? 'Modulo' : 'Standard'}
          </span>
        </div>

        {viewSettings.isModuloMode && (
          <div className="flex items-center gap-4 flex-1 md:max-w-xs lg:max-w-none bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-lg border border-indigo-100 dark:border-indigo-800 transition-colors duration-200">
            <label className="text-xs font-bold text-indigo-700 dark:text-indigo-300 whitespace-nowrap">Modulus (m): {viewSettings.modulus}</label>
            <input
              type="range"
              min="2"
              max="50"
              value={viewSettings.modulus}
              onChange={(e) => setViewSettings(prev => ({ ...prev, modulus: parseInt(e.target.value) }))}
              className="w-full h-2 bg-indigo-200 dark:bg-indigo-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400"
            />
          </div>
        )}
      </div>
    </div>
  );
};