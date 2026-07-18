"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { Database, Home, LineChart, Play, RefreshCw, Table2 } from "lucide-react";
import { executePython, ensurePyodide } from "@/lib/pyodideRunner";
import type { TerminalLine, VisualPayload } from "@/lib/types";
import { TerminalPanel } from "./TerminalPanel";
import { VisualizerPanel } from "./VisualizerPanel";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-sm text-slate-500">Loading editor...</div>
});

const NUMPY_ARRAY_SAMPLE = `import numpy as np

data = np.array([[1, 2, 3], [4, 5, 6]])
ones = np.ones((2, 3))

data + ones`;

const DATAFRAME_SAMPLE = `import pandas as pd
import numpy as np

sales = pd.DataFrame({
    "region": ["North", "South", "West", "East", "Central"],
    "revenue": [124, 98, 143, 88, 117],
    "margin": [0.28, 0.22, 0.31, 0.18, 0.25],
})

print("Rows:", len(sales))
sales.describe()`;

const CHART_SAMPLE = `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 8, 80)
y = np.sin(x) + np.cos(x / 2)

plt.plot(x, y, label="signal")
plt.title("Wave signal")
plt.xlabel("time")
plt.ylabel("amplitude")
plt.show()`;

const SERIES_SAMPLE = `import pandas as pd

temperatures = pd.Series(
    [71, 74, 78, 82, 79, 75, 72],
    index=["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    name="temperature"
)

temperatures`;

export function PyVisualsIde() {
  const [code, setCode] = useState(NUMPY_ARRAY_SAMPLE);
  const [visuals, setVisuals] = useState<VisualPayload[]>([]);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [status, setStatus] = useState("Loading Pyodide runtime");
  const [ready, setReady] = useState(false);
  const [liveUpdating, setLiveUpdating] = useState(false);
  const [running, setRunning] = useState(false);
  const liveRequestId = useRef(0);

  useEffect(() => {
    ensurePyodide(setStatus)
      .then(() => setReady(true))
      .catch((error) => {
        setStatus(error instanceof Error ? error.message : "Failed to load Python runtime");
      });
  }, []);

  const runLive = useCallback(
    async (source: string) => {
      const requestId = ++liveRequestId.current;
      setLiveUpdating(true);

      try {
        const result = await executePython(source, "live", setStatus);
        if (requestId === liveRequestId.current) {
          setVisuals(result.visuals);
          setTerminalLines(result.terminal);
        }
      } catch (error) {
        if (requestId === liveRequestId.current) {
          setVisuals([
            {
              kind: "text",
              title: "Runtime error",
              text: error instanceof Error ? error.message : String(error)
            }
          ]);
        }
      } finally {
        if (requestId === liveRequestId.current) {
          setLiveUpdating(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    if (!ready) {
      return;
    }

    setLiveUpdating(true);
    const handle = window.setTimeout(() => {
      void runLive(code);
    }, 650);

    return () => window.clearTimeout(handle);
  }, [code, ready, runLive]);

  function resetHome() {
    setTerminalLines([]);
    setVisuals([]);
    setCode(NUMPY_ARRAY_SAMPLE);
    if (ready) {
      void runLive(NUMPY_ARRAY_SAMPLE);
    }
  }

  function refreshVisuals() {
    if (ready) {
      void runLive(code);
    }
  }

  const runProgram = useCallback(async () => {
    setRunning(true);
    setTerminalLines([]);

    try {
      const result = await executePython(code, "run", setStatus);
      setVisuals(result.visuals);
      setTerminalLines(result.terminal.length ? result.terminal : [{ stream: "stdout", text: "Program completed with no output.\n" }]);
    } catch (error) {
      setTerminalLines([
        {
          stream: "stderr",
          text: `${error instanceof Error ? error.message : String(error)}\n`
        }
      ]);
    } finally {
      setRunning(false);
    }
  }, [code]);

  function loadSample(nextCode: string) {
    setTerminalLines([]);
    setCode(nextCode);
  }

  return (
    <main className="flex h-screen min-h-[720px] flex-col overflow-hidden bg-[#0c1017] text-slate-100">
      {!ready ? (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#0c1017]/95">
          <div className="w-[min(460px,90vw)] rounded-md border border-line bg-panel p-6 shadow-2xl">
            <div className="mb-4 h-1 overflow-hidden rounded-full bg-[#283244]">
              <div className="h-full w-2/3 animate-pulse bg-accent" />
            </div>
            <h1 className="text-lg font-semibold">Starting PyVisuals</h1>
            <p className="mt-2 text-sm text-slate-400">{status}. First load can take a few seconds.</p>
          </div>
        </div>
      ) : null}

      <header className="flex h-14 shrink-0 items-center justify-between border-b border-line bg-[#111722] px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-ink">
            <LineChart size={18} aria-hidden />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold">PyVisuals</h1>
            <p className="truncate text-xs text-slate-400">NumPy + Pandas visualization IDE in the browser</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="flex h-9 items-center gap-2 rounded-md border border-line bg-panelSoft px-3 text-sm text-slate-200 hover:border-accent"
            onClick={resetHome}
            type="button"
          >
            <Home size={16} aria-hidden />
            Home
          </button>
          <button
            className="flex h-9 items-center gap-2 rounded-md border border-line bg-panelSoft px-3 text-sm text-slate-200 hover:border-accent disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!ready || liveUpdating}
            onClick={refreshVisuals}
            type="button"
          >
            <RefreshCw size={16} aria-hidden />
            Refresh
          </button>
          <button
            className="flex h-9 items-center gap-2 rounded-md border border-line bg-panelSoft px-3 text-sm text-slate-200 hover:border-accent"
            onClick={() => loadSample(NUMPY_ARRAY_SAMPLE)}
            type="button"
          >
            <Database size={16} aria-hidden />
            NumPy
          </button>
          <button
            className="flex h-9 items-center gap-2 rounded-md border border-line bg-panelSoft px-3 text-sm text-slate-200 hover:border-accent"
            onClick={() => loadSample(DATAFRAME_SAMPLE)}
            type="button"
          >
            <Table2 size={16} aria-hidden />
            DataFrame
          </button>
          <button
            className="flex h-9 items-center gap-2 rounded-md border border-line bg-panelSoft px-3 text-sm text-slate-200 hover:border-accent"
            onClick={() => loadSample(CHART_SAMPLE)}
            type="button"
          >
            <LineChart size={16} aria-hidden />
            Chart
          </button>
          <button
            className="flex h-9 items-center gap-2 rounded-md border border-line bg-panelSoft px-3 text-sm text-slate-200 hover:border-accent"
            onClick={() => loadSample(SERIES_SAMPLE)}
            type="button"
          >
            <Database size={16} aria-hidden />
            Series
          </button>
          <button
            className="flex h-9 items-center gap-2 rounded-md bg-accent px-4 text-sm font-semibold text-ink hover:bg-[#78eee4] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!ready || running}
            onClick={() => void runProgram()}
            type="button"
          >
            <Play size={16} aria-hidden />
            Run
          </button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(420px,52vw)_minmax(360px,1fr)]">
        <section className="flex min-h-0 flex-col border-r border-line bg-[#10151d]">
          <div className="flex h-11 shrink-0 items-center justify-between border-b border-line px-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Code Editor</h2>
              <p className="text-xs text-slate-400">Python syntax, auto-indent, Ctrl+Enter to run</p>
            </div>
            <span className="text-xs text-slate-500">{status}</span>
          </div>
          <div className="min-h-0 flex-1">
            <MonacoEditor
              defaultLanguage="python"
              language="python"
              onChange={(value) => setCode(value ?? "")}
              onMount={(editor, monaco) => {
                editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
                  void runProgram();
                });
              }}
              options={{
                automaticLayout: true,
                fontFamily: "Consolas, 'Courier New', monospace",
                fontSize: 14,
                lineNumbers: "on",
                minimap: { enabled: false },
                padding: { top: 14, bottom: 14 },
                scrollBeyondLastLine: false,
                tabSize: 4,
                theme: "vs-dark"
              }}
              theme="vs-dark"
              value={code}
            />
          </div>
        </section>

        <aside className="flex min-h-0 flex-col">
          <VisualizerPanel ready={ready} updating={liveUpdating} visuals={visuals} />
          <TerminalPanel lines={terminalLines} running={running} />
        </aside>
      </div>
    </main>
  );
}
