"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Clock, Lock } from "lucide-react";
import { AuthNavActions } from "@/components/auth/AuthNavActions";

const MODULES = [
  {
    id: "numpy",
    name: "NumPy",
    description: "Numerical computing with N-dimensional arrays, vectorised operations, broadcasting, and linear algebra.",
    href: "/modules/numpy",
    available: true,
    color: "#4d8af0",
    bg: "rgba(77, 138, 240, 0.08)",
    border: "rgba(77, 138, 240, 0.2)",
    lessons: 13,
    duration: "~2 hours"
  },
  {
    id: "pandas",
    name: "Pandas",
    description: "Data manipulation and analysis with DataFrames, time series, groupby, and merging.",
    href: "#",
    available: false,
    color: "#4fd1c5",
    bg: "rgba(79, 209, 197, 0.05)",
    border: "rgba(79, 209, 197, 0.1)",
    lessons: null,
    duration: null
  },
  {
    id: "matplotlib",
    name: "Matplotlib",
    description: "Publication-quality data visualisation — line, bar, scatter, histograms, subplots, and more.",
    href: "#",
    available: false,
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.05)",
    border: "rgba(245, 158, 11, 0.1)",
    lessons: null,
    duration: null
  },
  {
    id: "seaborn",
    name: "Seaborn",
    description: "Statistical data visualisation built on Matplotlib with beautiful, informative graphics.",
    href: "#",
    available: false,
    color: "#f472b6",
    bg: "rgba(244, 114, 182, 0.05)",
    border: "rgba(244, 114, 182, 0.1)",
    lessons: null,
    duration: null
  },
  {
    id: "scipy",
    name: "SciPy",
    description: "Scientific and technical computing: optimisation, signal processing, statistics, and more.",
    href: "#",
    available: false,
    color: "#a78bfa",
    bg: "rgba(167, 139, 250, 0.05)",
    border: "rgba(167, 139, 250, 0.1)",
    lessons: null,
    duration: null
  },
  {
    id: "sklearn",
    name: "Scikit-learn",
    description: "Machine learning: classification, regression, clustering, model selection, and evaluation.",
    href: "#",
    available: false,
    color: "#fb923c",
    bg: "rgba(251, 146, 60, 0.05)",
    border: "rgba(251, 146, 60, 0.1)",
    lessons: null,
    duration: null
  },
  {
    id: "ml-launchpad",
    name: "ML Launchpad",
    description: "A 6-Day Machine Learning Bootcamp: Python, NumPy, Pandas, Data Visualisation, and Machine Learning.",
    href: "/modules/ml-launchpad",
    available: true,
    color: "#ec4899",
    bg: "rgba(236, 72, 153, 0.05)",
    border: "rgba(236, 72, 153, 0.1)",
    lessons: 6,
    duration: "9 hours"
  }
];

export default function ModulesPage() {
  return (
    <div className="min-h-screen bg-[#0c1017] text-slate-100">
      {/* Header */}
      <header className="border-b border-line bg-[#111722]">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-8 items-center gap-2 rounded-md border border-line bg-panelSoft px-3 text-sm text-slate-400 hover:border-accent hover:text-accent transition-colors"
            >
              <ArrowLeft size={14} />
              Home
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-sm font-medium text-slate-300">Modules</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/compiler"
              className="hidden h-8 items-center gap-2 rounded-md border border-line bg-panelSoft px-3 text-sm text-slate-400 hover:border-accent hover:text-accent transition-colors sm:flex"
            >
              Open Compiler →
            </Link>
            <AuthNavActions />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* Hero */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm text-accent">
            <BookOpen size={14} />
            Learning Modules
          </div>
          <h1 className="mb-3 text-4xl font-bold text-slate-100">
            Choose a Library
          </h1>
          <p className="text-slate-400 text-lg">
            Structured, interactive lessons with embedded code editors.
          </p>
        </div>

        {/* Module grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((mod) => (
            <ModuleCard key={mod.id} mod={mod} />
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-12 text-center text-sm text-slate-600">
          New modules are added regularly. All run entirely in your browser — no backend required.
        </p>
      </main>
    </div>
  );
}

type Mod = (typeof MODULES)[number];

function ModuleCard({ mod }: { mod: Mod }) {
  const card = (
    <div
      className={`group relative flex flex-col rounded-xl border p-5 transition-all duration-200
        ${mod.available
          ? "cursor-pointer hover:scale-[1.02] hover:shadow-xl"
          : "opacity-60 cursor-default"
        }`}
      style={{
        background: mod.bg,
        borderColor: mod.border
      }}
    >
      {/* Coming soon badge */}
      {!mod.available && (
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          <Lock size={8} />
          Coming Soon
        </div>
      )}

      {/* Icon */}
      <div
        className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold"
        style={{ background: `${mod.color}20`, color: mod.color }}
      >
        {mod.name[0]}
      </div>

      {/* Name */}
      <div className="mb-1 text-base font-semibold text-slate-100">{mod.name}</div>

      {/* Description */}
      <p className="mb-4 flex-1 text-sm text-slate-400 leading-relaxed">{mod.description}</p>

      {/* Meta */}
      {mod.available && mod.lessons && (
        <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-line/50 pt-3 mt-auto">
          <span className="flex items-center gap-1">
            <BookOpen size={11} />
            {mod.lessons} lessons
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {mod.duration}
          </span>
          <span className="ml-auto flex items-center gap-1 font-semibold" style={{ color: mod.color }}>
            Start <ArrowRight size={11} />
          </span>
        </div>
      )}
    </div>
  );

  return mod.available ? (
    <Link href={mod.href}>{card}</Link>
  ) : (
    card
  );
}
