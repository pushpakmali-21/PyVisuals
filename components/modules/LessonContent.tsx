"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, HelpCircle, Lightbulb, Terminal, CheckCheck } from "lucide-react";
import type { ContentBlock, Lesson } from "@/lib/modules/numpy";
import { CodeSandbox } from "./CodeSandbox";

type Props = {
  lesson: Lesson;
  prev: Lesson | null;
  next: Lesson | null;
  onNavigate: (id: string) => void;
  // Auth-aware progress props (optional, ignored when user not logged in)
  onMarkComplete?: (lessonId: string) => void;
  isCompleted?: boolean;
  isLoggedIn?: boolean;
};

export function LessonContent({ lesson, prev, next, onNavigate, onMarkComplete, isCompleted, isLoggedIn }: Props) {
  const [markedNow, setMarkedNow] = useState(false);

  function handleMarkComplete() {
    if (onMarkComplete) {
      onMarkComplete(lesson.id);
      setMarkedNow(true);
    }
  }

  const completed = isCompleted || markedNow;

  return (
    <div className="lesson-scrollbar flex h-full flex-col overflow-y-auto">
      {/* Lesson header */}
      <div className="border-b border-line bg-[#111722] px-8 py-6">
        <div className="text-xs font-semibold uppercase tracking-widest text-accent mb-1">
          NumPy Module
        </div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-100">{lesson.title}</h1>
          {isLoggedIn && (
            completed ? (
              <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1.5 text-xs font-semibold text-accent">
                <CheckCheck size={13} />
                Completed
              </div>
            ) : (
              <button
                type="button"
                onClick={handleMarkComplete}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-panelSoft px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:border-accent/40 hover:text-accent"
              >
                <CheckCheck size={13} />
                Mark complete
              </button>
            )
          )}
        </div>
      </div>

      {/* Content blocks */}
      <div className="flex-1 px-8 py-6 space-y-6">
        {lesson.blocks.map((block, index) => (
          <BlockRenderer key={index} block={block} />
        ))}
      </div>

      {/* Prev / Next navigation */}
      <div className="border-t border-line px-8 py-5 flex items-center justify-between gap-4">
        {prev ? (
          <button
            type="button"
            onClick={() => onNavigate(prev.id)}
            className="flex items-center gap-2 rounded-lg border border-line bg-panelSoft px-4 py-2.5 text-sm text-slate-300 hover:border-accent hover:text-accent transition-colors"
          >
            ← {prev.title}
          </button>
        ) : (
          <div />
        )}
        {next ? (
          <button
            type="button"
            onClick={() => onNavigate(next.id)}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-ink hover:bg-[#78eee4] transition-colors"
          >
            {next.title} →
          </button>
        ) : (
          <div className="text-sm text-slate-600 italic">End of module 🎉</div>
        )}
      </div>
    </div>
  );
}

/* ── Block renderers ──────────────────────────────────── */

function BlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "prose":
      return (
        <div
          className="lesson-prose"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      );

    case "code":
      return (
        <div className="rounded-lg border border-line overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line bg-[#111722] px-4 py-2">
            <Terminal size={13} className="text-slate-500" />
            <span className="text-xs font-medium text-slate-400">{block.label}</span>
          </div>
          <pre className="overflow-auto p-4 font-mono text-sm text-accent bg-[#0b0f15] leading-6">
            {block.code}
          </pre>
        </div>
      );

    case "sandbox":
      return <CodeSandbox label={block.label} code={block.code} hint={block.hint} />;

    case "exercise":
      return <ExerciseBlock block={block} />;

    case "quiz":
      return <QuizBlock block={block} />;

    case "tip":
      return (
        <div className="flex gap-3 rounded-lg border border-accent/20 bg-accent/5 px-4 py-3">
          <Lightbulb size={16} className="mt-0.5 shrink-0 text-accent" />
          <p className="text-sm text-slate-300">{block.text}</p>
        </div>
      );

    case "warning":
      return (
        <div className="flex gap-3 rounded-lg border border-warn/30 bg-warn/5 px-4 py-3">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-warn" />
          <p className="text-sm text-slate-300">{block.text}</p>
        </div>
      );

    default:
      return null;
  }
}

function ExerciseBlock({ block }: { block: Extract<ContentBlock, { type: "exercise" }> }) {
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="rounded-lg border border-electric/20 bg-electric/5 overflow-hidden">
      <div className="flex items-center gap-2 border-b border-electric/20 bg-electric/10 px-4 py-3">
        <HelpCircle size={15} className="text-electric" />
        <span className="text-sm font-semibold text-electric">Exercise</span>
      </div>
      <div className="p-4 space-y-4">
        <div
          className="lesson-prose text-sm"
          dangerouslySetInnerHTML={{ __html: block.question.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>") }}
        />
        <CodeSandbox label="Your workspace" code={block.starterCode} />
        {block.hint && (
          <div>
            {!showHint ? (
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="text-xs text-slate-500 underline underline-offset-2 hover:text-slate-300 transition-colors"
              >
                Show hint
              </button>
            ) : (
              <div className="flex gap-2 rounded-md border border-slate-700 bg-panelSoft px-3 py-2 text-xs text-slate-400">
                <Lightbulb size={12} className="mt-0.5 shrink-0 text-slate-500" />
                {block.hint}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function QuizBlock({ block }: { block: Extract<ContentBlock, { type: "quiz" }> }) {
  const [selected, setSelected] = useState<number | null>(null);
  const submitted = selected !== null;
  const isCorrect = selected === block.correct;

  return (
    <div className="rounded-lg border border-violet/20 bg-violet/5 overflow-hidden">
      <div className="flex items-center gap-2 border-b border-violet/20 bg-violet/10 px-4 py-3">
        <HelpCircle size={15} className="text-violet" />
        <span className="text-sm font-semibold text-violet">Quick Quiz</span>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-sm font-medium text-slate-200">{block.question}</p>
        <div className="space-y-2">
          {block.options.map((option, index) => {
            let cls = "flex items-center gap-3 rounded-lg border px-4 py-2.5 text-sm cursor-pointer transition-all ";
            if (!submitted) {
              cls += "border-line bg-panelSoft hover:border-violet/50 hover:bg-violet/10 text-slate-300";
            } else if (index === block.correct) {
              cls += "border-green-500/40 bg-green-500/10 text-green-400";
            } else if (index === selected) {
              cls += "border-red-500/40 bg-red-500/10 text-red-400";
            } else {
              cls += "border-line bg-panelSoft/50 text-slate-500 opacity-60";
            }

            return (
              <button
                key={index}
                type="button"
                onClick={() => !submitted && setSelected(index)}
                className={`w-full text-left ${cls}`}
              >
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold
                  ${submitted && index === block.correct ? "border-green-500 text-green-400"
                    : submitted && index === selected ? "border-red-500 text-red-400"
                    : "border-slate-600 text-slate-500"}`}>
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {submitted && (
          <div className={`flex items-start gap-2 rounded-lg px-3 py-2 text-sm
            ${isCorrect ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
            {isCorrect
              ? <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
              : <AlertCircle size={14} className="mt-0.5 shrink-0" />
            }
            <span>{isCorrect ? "Correct! " : "Not quite. "}{block.explanation}</span>
          </div>
        )}
      </div>
    </div>
  );
}
