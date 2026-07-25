import React, { useState, useEffect } from "react";
import { Terminal, Play, Info, AlertCircle, CheckCircle, Database, HelpCircle, Code } from "lucide-react";
import { motion } from "motion/react";

interface SQLConsoleProps {
  rollNumber: string;
  onRefreshDBLogs: () => void;
}

export default function SQLConsole({ rollNumber, onRefreshDBLogs }: SQLConsoleProps) {
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM events WHERE category = 'upcoming'");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [sqlLogs, setSqlLogs] = useState<any[]>([]);

  const fetchSqlLogs = async () => {
    try {
      const res = await fetch("/api/sql/logs");
      const data = await res.json();
      if (data.success) {
        setSqlLogs(data.logs.reverse());
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSqlLogs();
    const interval = setInterval(fetchSqlLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const runQuery = async (query: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/sql/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql: query })
      });
      const data = await res.json();
      if (data.success) {
        setResult(data);
        fetchSqlLogs();
        onRefreshDBLogs();
      } else {
        setError(data.error || "Execution failed.");
      }
    } catch (err) {
      setError("Failed to execute query.");
    } finally {
      setLoading(false);
    }
  };

  const sqlTemplates = [
    { name: "List Upcoming Events", query: "SELECT * FROM events WHERE category = 'upcoming'" },
    { name: "Select Active Clubs", query: "SELECT * FROM clubs" },
    { name: "Search Faculty from CS", query: "SELECT * FROM faculty WHERE department = 'Computer Science & Engineering'" },
    { name: "View Monday Classes", query: "SELECT * FROM timetable WHERE day = 'Monday'" },
    { name: "Student Registrations", query: `SELECT * FROM registrations WHERE roll_number = '${rollNumber}'` }
  ];

  return (
    <div id="sql-console-panel" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Schema and Templates Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        {/* SQL Tables Scheme */}
        <div className="bg-cyber-slate/50 border border-cyber-blue/15 rounded-xl p-5 backdrop-blur-md">
          <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Database className="w-4.5 h-4.5 text-cyber-blue" />
            Relational Schema
          </h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar text-xs">
            {/* Table events */}
            <div className="p-3 bg-cyber-dark/40 border border-cyber-blue/10 rounded-lg">
              <span className="font-mono font-bold text-cyber-blue">events</span>
              <ul className="mt-1 space-y-1 font-mono text-[10px] text-gray-400 pl-3 border-l border-cyber-blue/20">
                <li>id <span className="text-gray-500">(INT, PK)</span></li>
                <li>title <span className="text-gray-500">(VARCHAR)</span></li>
                <li>description <span className="text-gray-500">(TEXT)</span></li>
                <li>date <span className="text-gray-500">(DATE)</span></li>
                <li>time <span className="text-gray-500">(VARCHAR)</span></li>
                <li>venue <span className="text-gray-500">(VARCHAR)</span></li>
                <li>category <span className="text-gray-500">(VARCHAR)</span></li>
                <li>eligible_year <span className="text-gray-500">(VARCHAR)</span></li>
              </ul>
            </div>

            {/* Table clubs */}
            <div className="p-3 bg-cyber-dark/40 border border-cyber-blue/10 rounded-lg">
              <span className="font-mono font-bold text-cyber-blue">clubs</span>
              <ul className="mt-1 space-y-1 font-mono text-[10px] text-gray-400 pl-3 border-l border-cyber-blue/20">
                <li>id <span className="text-gray-500">(INT, PK)</span></li>
                <li>name <span className="text-gray-500">(VARCHAR)</span></li>
                <li>description <span className="text-gray-500">(TEXT)</span></li>
                <li>lead <span className="text-gray-500">(VARCHAR)</span></li>
                <li>contact <span className="text-gray-500">(VARCHAR)</span></li>
                <li>members_count <span className="text-gray-500">(INT)</span></li>
              </ul>
            </div>

            {/* Table faculty */}
            <div className="p-3 bg-cyber-dark/40 border border-cyber-blue/10 rounded-lg">
              <span className="font-mono font-bold text-cyber-blue">faculty</span>
              <ul className="mt-1 space-y-1 font-mono text-[10px] text-gray-400 pl-3 border-l border-cyber-blue/20">
                <li>id <span className="text-gray-500">(INT, PK)</span></li>
                <li>name <span className="text-gray-500">(VARCHAR)</span></li>
                <li>department <span className="text-gray-500">(VARCHAR)</span></li>
                <li>designation <span className="text-gray-500">(VARCHAR)</span></li>
                <li>email <span className="text-gray-500">(VARCHAR)</span></li>
                <li>office <span className="text-gray-500">(VARCHAR)</span></li>
              </ul>
            </div>

            {/* Table timetable */}
            <div className="p-3 bg-cyber-dark/40 border border-cyber-blue/10 rounded-lg">
              <span className="font-mono font-bold text-cyber-blue">timetable</span>
              <ul className="mt-1 space-y-1 font-mono text-[10px] text-gray-400 pl-3 border-l border-cyber-blue/20">
                <li>id <span className="text-gray-500">(INT, PK)</span></li>
                <li>day <span className="text-gray-500">(VARCHAR)</span></li>
                <li>time_slot <span className="text-gray-500">(VARCHAR)</span></li>
                <li>subject <span className="text-gray-500">(VARCHAR)</span></li>
                <li>room <span className="text-gray-500">(VARCHAR)</span></li>
                <li>faculty_name <span className="text-gray-500">(VARCHAR)</span></li>
                <li>course_code <span className="text-gray-500">(VARCHAR)</span></li>
              </ul>
            </div>

            {/* Table registrations */}
            <div className="p-3 bg-cyber-dark/40 border border-cyber-blue/10 rounded-lg">
              <span className="font-mono font-bold text-cyber-blue">registrations</span>
              <ul className="mt-1 space-y-1 font-mono text-[10px] text-gray-400 pl-3 border-l border-cyber-blue/20">
                <li>id <span className="text-gray-500">(INT, PK)</span></li>
                <li>roll_number <span className="text-gray-500">(VARCHAR, FK)</span></li>
                <li>event_id <span className="text-gray-500">(INT, FK)</span></li>
                <li>registered_at <span className="text-gray-500">(DATETIME)</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick SQL Templates */}
        <div className="bg-cyber-slate/50 border border-cyber-blue/15 rounded-xl p-5 backdrop-blur-md">
          <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <Code className="w-4.5 h-4.5 text-cyber-blue" />
            Query Templates
          </h3>
          <p className="text-[11px] text-gray-400 mb-4">Click any pre-written SQL statement to load and execute it instantly.</p>
          <div className="space-y-2">
            {sqlTemplates.map((tpl, i) => (
              <button
                key={i}
                onClick={() => { setSqlQuery(tpl.query); runQuery(tpl.query); }}
                className="w-full text-left p-2.5 bg-cyber-dark/40 hover:bg-cyber-blue/10 border border-cyber-blue/10 hover:border-cyber-blue/30 rounded-lg text-xs font-mono text-gray-300 transition-all flex justify-between items-center group cursor-pointer"
              >
                <span>{tpl.name}</span>
                <Play className="w-3 h-3 text-cyber-blue group-hover:text-cyber-neon transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Terminal Editor & Output */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-cyber-slate/50 border border-cyber-blue/15 rounded-xl p-5 backdrop-blur-md flex flex-col min-h-[400px]">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 border-b border-cyber-blue/15 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyber-neon" />
              <span className="text-sm font-mono text-white font-bold tracking-wider">SQL QUERY TERMINAL</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-cyber-neon rounded-full animate-ping" />
              <span className="text-[10px] font-mono text-cyber-neon uppercase tracking-widest">Database Node Active</span>
            </div>
          </div>

          {/* Textarea Editor */}
          <div className="relative mb-4 flex-1">
            <textarea
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              className="w-full h-36 p-4 bg-cyber-dark/80 border border-cyber-blue/35 rounded-lg focus:outline-none focus:border-cyber-blue text-sm font-mono text-emerald-400 placeholder-gray-600 resize-none"
              placeholder="Type your SELECT, INSERT, or UPDATE statement here..."
            />
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button
                id="btn-execute-sql"
                disabled={loading}
                onClick={() => runQuery(sqlQuery)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyber-blue to-cyan-600 hover:from-cyan-600 hover:to-cyber-blue text-white font-mono text-xs uppercase tracking-wider rounded-md transition-all shadow-md hover:shadow-cyber-blue/30 disabled:opacity-50 border border-white/10 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Run Code
              </button>
            </div>
          </div>

          {/* Execution Output */}
          <div className="mt-4 border-t border-cyber-blue/15 pt-4 flex-1">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-2">Query Output:</h4>

            {loading && (
              <div className="py-8 flex flex-col items-center justify-center text-gray-400 font-mono text-xs gap-2">
                <div className="w-6 h-6 border-2 border-cyber-blue border-t-transparent rounded-full animate-spin" />
                <span>Executing SQL instructions...</span>
              </div>
            )}

            {!loading && !result && !error && (
              <div className="py-8 flex flex-col items-center justify-center text-gray-500 font-mono text-xs gap-1.5 text-center">
                <HelpCircle className="w-8 h-8 text-cyber-blue/30" />
                <span>No query executed yet.</span>
                <span className="text-[10px] text-gray-600">Enter a query above or click a template to start.</span>
              </div>
            )}

            {!loading && error && (
              <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-lg font-mono text-xs text-red-200 flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold uppercase text-red-400">Database Transaction Failed</span>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {!loading && result && (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg font-mono text-xs text-emerald-200 flex items-center gap-2">
                  <CheckCircle className="w-4.5 h-4.5 text-cyber-neon" />
                  <span>
                    Success: {result.rows ? `${result.rows.length} rows returned` : `${result.affectedRows} rows affected`}
                  </span>
                </div>

                {result.rows && result.rows.length > 0 && (
                  <div className="overflow-x-auto border border-cyber-blue/15 rounded-lg max-h-[220px]">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-cyber-dark/80 text-white uppercase border-b border-cyber-blue/15">
                        <tr>
                          {Object.keys(result.rows[0]).map((key, idx) => (
                            <th key={idx} className="px-4 py-2 border-r border-cyber-blue/10 last:border-0">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-cyber-blue/10 text-gray-300">
                        {result.rows.map((row: any, rIdx: number) => (
                          <tr key={rIdx} className="hover:bg-cyber-blue/5">
                            {Object.values(row).map((val: any, cIdx: number) => (
                              <td key={cIdx} className="px-4 py-2 border-r border-cyber-blue/10 last:border-0 truncate max-w-xs">
                                {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {result.rows && result.rows.length === 0 && (
                  <div className="py-6 border border-cyber-blue/15 rounded-lg text-center font-mono text-xs text-gray-500 bg-cyber-dark/30">
                    Query completed successfully, but returned 0 records.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Real-time Query Activity Logs */}
        <div className="bg-cyber-slate/50 border border-cyber-blue/15 rounded-xl p-5 backdrop-blur-md">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyber-blue animate-pulse" />
              Live SQL Log Trace
            </h3>
            <span className="text-[10px] font-mono text-gray-500 uppercase">Updates live</span>
          </div>
          <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar font-mono text-[10px]">
            {sqlLogs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Waiting for transaction triggers...</p>
            ) : (
              sqlLogs.map((log: any, idx: number) => (
                <div key={idx} className="p-2 bg-cyber-dark/50 border border-cyber-blue/5 rounded flex justify-between items-start gap-4">
                  <div className="truncate flex-1">
                    <span className="text-gray-500 mr-2">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    <span className={log.success ? "text-emerald-400" : "text-red-400"}>{log.query}</span>
                  </div>
                  <span className={`shrink-0 px-1.5 py-0.5 rounded text-[8px] uppercase font-bold ${
                    log.success ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/35" : "bg-red-950/80 text-red-300 border border-red-500/35"
                  }`}>
                    {log.success ? `SUCCESS (${log.rowsCount}r)` : "ERROR"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
