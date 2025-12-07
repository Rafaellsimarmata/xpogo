"use client";

import { useEffect, useState } from "react";

// Global logs array that starts capturing immediately
let globalLogs: string[] = [];
let originalLog: typeof console.log;
let originalError: typeof console.error;
let originalWarn: typeof console.warn;

// Start capturing logs at module level
if (typeof window !== 'undefined') {
  originalLog = console.log;
  originalError = console.error;
  originalWarn = console.warn;

  const addLog = (type: string, args: unknown[]) => {
    const message = args.map(arg => {
      if (typeof arg === 'object') return JSON.stringify(arg);
      return String(arg);
    }).join(' ');
    
    if (message.includes('[')) {  // Only log our debug messages
      globalLogs.push(`[${type}] ${message}`);
      if (globalLogs.length > 100) globalLogs = globalLogs.slice(-100);
    }
  };

  console.log = (...args) => {
    originalLog(...args);
    addLog('LOG', args);
  };

  console.error = (...args) => {
    originalError(...args);
    addLog('ERROR', args);
  };

  console.warn = (...args) => {
    originalWarn(...args);
    addLog('WARN', args);
  };
}

export const RenderDiagnostics = () => {
  const [logs, setLogs] = useState<string[]>(() => [...globalLogs]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Update logs when global logs change
    const interval = setInterval(() => {
      setLogs([...globalLogs]);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 bg-slate-900 text-white text-xs rounded-lg shadow-lg hover:bg-slate-800"
      >
        {isOpen ? 'Hide' : 'Show'} Logs
      </button>
      
      {isOpen && (
        <div className="absolute bottom-12 right-0 bg-slate-900 text-white rounded-lg shadow-xl p-3 max-w-md max-h-96 overflow-auto text-xs font-mono">
          <div className="space-y-1">
            {logs.length === 0 ? (
              <div className="text-gray-400">No logs yet...</div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="text-gray-200 wrap-break-word">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
