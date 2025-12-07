"use client";

import { useEffect, useState } from "react";

export const RenderDiagnostics = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Intercept console.log
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    const addLog = (type: string, args: unknown[]) => {
      const message = args.map(arg => {
        if (typeof arg === 'object') return JSON.stringify(arg);
        return String(arg);
      }).join(' ');
      
      if (message.includes('[')) {  // Only log our debug messages
        setLogs(prev => [...prev.slice(-20), `[${type}] ${message}`]); // Keep last 20 logs
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

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
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
