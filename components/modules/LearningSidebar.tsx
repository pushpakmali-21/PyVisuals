"use client";

import { BookOpen, ChevronRight, Clock, CheckCheck } from "lucide-react";
import type { LessonGroup, Lesson } from "@/lib/modules/numpy";

type Props = {
  groups: LessonGroup[];
  activeId: string;
  onSelect: (id: string) => void;
  completedIds?: Set<string>;
};

export function LearningSidebar({ groups, activeId, onSelect, completedIds }: Props) {
  const totalLessons = groups.flatMap((g) => g.lessons).length;
  const completedCount = completedIds ? completedIds.size : 0;

  return (
    <nav className="sidebar-scrollbar flex h-full flex-col overflow-y-auto bg-[#0f1623] border-r border-line">
      {/* Sidebar header */}
      <div className="flex items-center gap-3 border-b border-line px-4 py-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <BookOpen size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-slate-100">NumPy</div>
          <div className="text-xs text-slate-500">Learning Module</div>
        </div>
      </div>

      {/* Progress bar (only when there's progress) */}
      {completedIds && completedCount > 0 && (
        <div className="border-b border-line px-4 py-3">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
              Progress
            </span>
            <span className="text-[10px] text-slate-500">
              {completedCount}/{totalLessons}
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-accent transition-all duration-700"
              style={{ width: `${(completedCount / totalLessons) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Lesson groups */}
      <div className="flex-1 py-2">
        {groups.map((group) => (
          <LessonGroup
            key={group.id}
            group={group}
            activeId={activeId}
            onSelect={onSelect}
            completedIds={completedIds}
          />
        ))}
      </div>

      {/* Footer note */}
      <div className="border-t border-line px-4 py-3 text-xs text-slate-600">
        More modules coming soon
      </div>
    </nav>
  );
}

function LessonGroup({
  group,
  activeId,
  onSelect,
  completedIds,
}: {
  group: LessonGroup;
  activeId: string;
  onSelect: (id: string) => void;
  completedIds?: Set<string>;
}) {
  const isGroupActive = group.lessons.some((l) => l.id === activeId);

  return (
    <div className="mb-1">
      {/* Group label */}
      <div className="flex items-center gap-2 px-4 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
          {group.title}
        </span>
        {isGroupActive && (
          <div className="h-1 w-1 rounded-full bg-accent" />
        )}
      </div>

      {/* Lessons */}
      {group.lessons.map((lesson) => (
        <LessonItem
          key={lesson.id}
          lesson={lesson}
          active={lesson.id === activeId}
          onSelect={onSelect}
          completed={completedIds?.has(lesson.id) ?? false}
        />
      ))}
    </div>
  );
}

function LessonItem({
  lesson,
  active,
  onSelect,
  completed,
}: {
  lesson: Lesson;
  active: boolean;
  onSelect: (id: string) => void;
  completed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(lesson.id)}
      className={`group flex w-full items-center gap-2 px-4 py-2.5 text-left transition-all duration-150
        ${active
          ? "bg-accent/10 text-accent"
          : "text-slate-400 hover:bg-white/4 hover:text-slate-200"
        }`}
    >
      <ChevronRight
        size={12}
        className={`shrink-0 transition-transform duration-150 ${active ? "rotate-90 text-accent" : "text-slate-600 group-hover:text-slate-400"}`}
      />
      <div className="min-w-0 flex-1">
        <div className={`truncate text-sm font-medium ${active ? "text-accent" : ""}`}>
          {lesson.title}
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-600">
          <Clock size={10} />
          {lesson.duration}
        </div>
      </div>
      {completed && !active && (
        <CheckCheck size={12} className="shrink-0 text-accent/60" />
      )}
      {active && (
        <div className="ml-auto h-4 w-0.5 rounded-full bg-accent" />
      )}
    </button>
  );
}
