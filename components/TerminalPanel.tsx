"use client";

import { useEffect, useRef } from "react";
import type { TerminalLine } from "@/lib/types";

type TerminalPanelProps = {
  lines: TerminalLine[];
  running: boolean;
};

export function TerminalPanel({ lines, running }: TerminalPanelProps) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  return (
    <section className="flex min-h-0 flex-1 flex-col bg-[#0b0f15]">
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-line px-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">Terminal / Output</h2>
          <p className="text-xs text-slate-400">Standard output and errors</p>
        </div>
        <span className="text-xs text-slate-400">{running ? "running..." : "idle"}</span>
      </div>
      <div className="terminal-scrollbar min-h-0 flex-1 overflow-auto p-4 font-mono text-sm leading-6">
        {lines.length === 0 ? (
          <div className="text-slate-600">Press Run or Ctrl+Enter to execute the program.</div>
        ) : (
          lines.map((line, index) => (
            <span
              key={index}
              className={line.stream === "stderr" ? "whitespace-pre-wrap text-red-400" : "whitespace-pre-wrap text-slate-200"}
            >
              {line.text}
            </span>
          ))
        )}
        <div ref={endRef} />
      </div>
    </section>
  );
}
