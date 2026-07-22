"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Menu, X } from "lucide-react";
import { NUMPY_MODULE, getFirstLesson, getLessonById, getAdjacentLessons } from "@/lib/modules/numpy";
import { LearningSidebar } from "@/components/modules/LearningSidebar";
import { LessonContent } from "@/components/modules/LessonContent";
import { AuthNavActions } from "@/components/auth/AuthNavActions";
import { useAuth } from "@/contexts/AuthContext";
import { saveUserProgress, isLessonCompleted } from "@/lib/auth";

export default function NumPyPage() {
  const [activeId, setActiveId] = useState(getFirstLesson().id);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const lesson = getLessonById(activeId) ?? getFirstLesson();
  const { prev, next } = getAdjacentLessons(activeId);

  const navigate = useCallback((id: string) => {
    setActiveId(id);
    setSidebarOpen(false);
    // Mark current lesson complete when moving away (if logged in)
    if (user) {
      saveUserProgress(user.userId, activeId, true);
    }
    window.requestAnimationFrame(() => {
      document.getElementById("lesson-main")?.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, [activeId, user]);

  const handleMarkComplete = useCallback((lessonId: string) => {
    if (user) {
      saveUserProgress(user.userId, lessonId, true);
    }
  }, [user]);

  // Build a set of completed lesson IDs for sidebar
  const completedIds = new Set(
    user
      ? NUMPY_MODULE.flatMap((g) => g.lessons)
          .filter((l) => isLessonCompleted(user.userId, l.id))
          .map((l) => l.id)
      : []
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0c1017] text-slate-100">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-line bg-[#111722] px-4 z-20">
        <div className="flex items-center gap-3">
          {/* Mobile sidebar toggle */}
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-line bg-panelSoft text-slate-400 hover:border-accent hover:text-accent transition-colors md:hidden"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

          <Link
            href="/modules"
            className="flex h-8 items-center gap-2 rounded-md border border-line bg-panelSoft px-3 text-sm text-slate-400 hover:border-accent hover:text-accent transition-colors"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Modules</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-[#4d8af0]/20 flex items-center justify-center text-xs font-bold text-[#4d8af0]">N</div>
            <span className="font-semibold text-slate-100">NumPy</span>
            <span className="hidden text-slate-500 sm:inline">/ {lesson.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress indicator (only when logged in) */}
          {user && (
            <div className="hidden items-center gap-2 sm:flex">
              <div className="h-1 w-20 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-500"
                  style={{
                    width: `${
                      (completedIds.size /
                        NUMPY_MODULE.flatMap((g) => g.lessons).length) *
                      100
                    }%`,
                  }}
                />
              </div>
              <span className="text-xs text-slate-500">
                {completedIds.size}/{NUMPY_MODULE.flatMap((g) => g.lessons).length}
              </span>
            </div>
          )}
          <AuthNavActions />
        </div>
      </header>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        {/* Mobile overlay sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/60 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed top-14 bottom-0 left-0 z-30 w-64 transition-transform duration-300
            md:relative md:top-auto md:bottom-auto md:z-auto md:translate-x-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <LearningSidebar
            groups={NUMPY_MODULE}
            activeId={activeId}
            onSelect={navigate}
            completedIds={completedIds}
          />
        </aside>

        {/* Lesson content */}
        <main id="lesson-main" className="min-w-0 flex-1 overflow-hidden">
          <LessonContent
            lesson={lesson}
            prev={prev}
            next={next}
            onNavigate={navigate}
            onMarkComplete={handleMarkComplete}
            isCompleted={isLessonCompleted(user?.userId, lesson.id)}
            isLoggedIn={!!user}
          />
        </main>
      </div>
    </div>
  );
}
