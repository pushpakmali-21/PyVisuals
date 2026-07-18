"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Terminal } from "lucide-react";
import { ensurePyodide, executePython } from "@/lib/pyodideRunner";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-32 items-center justify-center text-xs text-slate-500">
      Loading editor...
    </div>
  )
});

type Props = {
  label: string;
  code: string;
  hint?: string;
};

type OutputLine = {
  stream: "stdout" | "stderr";
  text: string;
};

export function CodeSandbox({ label, code: initialCode }: Props) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [running, setRunning] = useState(false);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("Loading...");
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensurePyodide(setStatus)
      .then(() => {
        setReady(true);
        setStatus("ready");
      })
      .catch(() => setStatus("failed"));
  }, []);

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight });
  }, [output]);

  const runCode = useCallback(async () => {
    if (!ready || running) return;
    setRunning(true);
    setOutput([]);

    try {
      const result = await executePython(code, "run", setStatus);
      const lines: OutputLine[] =
        result.terminal.length > 0
          ? result.terminal
          : [{ stream: "stdout", text: "✓ No output produced.\n" }];
      setOutput(lines);
    } catch (err) {
      setOutput([
        {
          stream: "stderr",
          text: `${err instanceof Error ? err.message : String(err)}\n`
        }
      ]);
    } finally {
      setRunning(false);
    }
  }, [ready, running, code]);

  function resetCode() {
    setCode(initialCode);
    setOutput([]);
  }

  /* Editor height: roughly 22px per line, clamped 120–320px */
  const lineCount = initialCode.split("\n").length;
  const editorHeight = Math.min(320, Math.max(120, lineCount * 22));

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-[#0b0f15]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line bg-[#111722] px-4 py-2">
        <div className="flex items-center gap-2">
          <Terminal size={13} className="text-accent" />
          <span className="text-xs font-medium text-slate-300">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {!ready && (
            <span className="text-xs text-slate-600 animate-pulse">{status}</span>
          )}
          <button
            type="button"
            onClick={resetCode}
            className="flex h-7 items-center gap-1.5 rounded px-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            title="Reset to original"
          >
            <RotateCcw size={11} />
            Reset
          </button>
          <button
            type="button"
            onClick={() => void runCode()}
            disabled={!ready || running}
            className="flex h-7 items-center gap-1.5 rounded bg-accent/90 px-3 text-xs font-semibold text-ink hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Play size={11} />
            {running ? "Running..." : "Run"}
          </button>
        </div>
      </div>

      {/* Monaco editor */}
      <div style={{ height: editorHeight }}>
        <MonacoEditor
          value={code}
          onChange={(v) => setCode(v ?? "")}
          language="python"
          options={{
            automaticLayout: true,
            fontSize: 13,
            fontFamily: "Consolas, 'Courier New', monospace",
            lineNumbers: "on",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 10, bottom: 10 },
            tabSize: 4,
            theme: "vs-dark",
            wordWrap: "on",
            overviewRulerBorder: false,
            renderLineHighlight: "line"
          }}
          theme="vs-dark"
        />
      </div>

      {/* Output */}
      {output.length > 0 && (
        <div
          ref={outputRef}
          className="terminal-scrollbar border-t border-line max-h-48 overflow-y-auto p-3 font-mono text-xs leading-5 bg-[#070a0e]"
        >
          {output.map((line, i) => (
            <span
              key={i}
              className={
                line.stream === "stderr"
                  ? "whitespace-pre-wrap text-red-400"
                  : "whitespace-pre-wrap text-slate-300"
              }
            >
              {line.text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
