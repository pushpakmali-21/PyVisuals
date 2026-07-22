"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Code2,
  ExternalLink,
  Github,
  LayoutTemplate,
  Play,
  Sparkles,
  Terminal,
  TrendingUp,
  Zap
} from "lucide-react";
import { AuthNavActions } from "@/components/auth/AuthNavActions";

/* ── Floating background particles ───────────────────── */
type Particle = {
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  shape: "circle" | "square" | "triangle";
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

const PARTICLE_COLORS = [
  "rgba(79,209,197,0.25)",
  "rgba(96,165,250,0.2)",
  "rgba(167,139,250,0.2)",
  "rgba(79,209,197,0.15)",
  "rgba(245,158,11,0.18)"
];

const PARTICLES: Particle[] = Array.from({ length: 18 }, (_, i) => ({
  x: (i * 37 + 11) % 100,
  y: (i * 53 + 7) % 100,
  size: 8 + (i % 5) * 10,
  color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
  delay: (i * 0.7) % 6,
  duration: 5 + (i % 4) * 2,
  shape: (["circle", "square", "triangle"] as const)[i % 3]
}));

function ParticleShape({ p }: { p: Particle }) {
  const reduced = usePrefersReducedMotion();
  const cls = reduced
    ? ""
    : p.shape === "circle"
    ? "animate-float"
    : p.shape === "square"
    ? "animate-float-reverse"
    : "animate-float";

  if (p.shape === "triangle") {
    return (
      <div
        className={cls}
        style={{
          position: "absolute",
          left: `${p.x}%`,
          top: `${p.y}%`,
          width: 0,
          height: 0,
          borderLeft: `${p.size / 2}px solid transparent`,
          borderRight: `${p.size / 2}px solid transparent`,
          borderBottom: `${p.size}px solid ${p.color}`,
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.duration}s`
        }}
      />
    );
  }

  return (
    <div
      className={cls}
      style={{
        position: "absolute",
        left: `${p.x}%`,
        top: `${p.y}%`,
        width: p.size,
        height: p.size,
        borderRadius: p.shape === "circle" ? "50%" : "4px",
        background: p.color,
        animationDelay: `${p.delay}s`,
        animationDuration: `${p.duration}s`,
        transform: p.shape === "square" ? "rotate(45deg)" : undefined
      }}
    />
  );
}

/* ── Parallax mouse hook ─────────────────────────────── */
function useParallax() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setOffset({
        x: ((e.clientX - cx) / cx) * 18,
        y: ((e.clientY - cy) / cy) * 12
      });
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);
  return offset;
}

/* ── Intersection observer for reveal ────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ── Animated counter ────────────────────────────────── */
function Counter({ to, label, suffix = "" }: { to: number; label: string; suffix?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1400;
          const step = 16;
          const steps = duration / step;
          let i = 0;
          const interval = setInterval(() => {
            i++;
            const t = i / steps;
            const eased = 1 - Math.pow(1 - t, 3);
            setValue(Math.round(eased * to));
            if (i >= steps) clearInterval(interval);
          }, step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [to]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1 text-center">
      <div className="text-3xl font-bold gradient-text tabular-nums">
        {value}
        {suffix}
      </div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}

/* ── Card tilt hook ──────────────────────────────────── */
function useTilt(ref: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rx = ((e.clientY - cy) / (rect.height / 2)) * -6;
      const ry = ((e.clientX - cx) / (rect.width / 2)) * 6;
      el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.025)`;
    };

    const onLeave = () => {
      el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [ref]);
}

/* ── Action Card ─────────────────────────────────────── */
function ActionCard({
  href,
  icon: Icon,
  color,
  title,
  description,
  cta,
  badge,
  tags
}: {
  href: string;
  icon: React.ElementType;
  color: string;
  title: string;
  description: string;
  cta: string;
  badge?: string;
  tags?: { label: string; active?: boolean }[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  useTilt(ref);

  return (
    <div
      ref={ref}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line/60 glass-card p-7 transition-all duration-300 hover:border-opacity-60 hover:shadow-2xl"
      style={{
        ["--card-color" as string]: color,
        transition: "transform 0.12s ease, box-shadow 0.3s ease"
      }}
    >
      {/* Glow layer */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${color}18 0%, transparent 70%)`
        }}
      />

      {/* Animated border */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: `0 0 0 1px ${color}40, 0 0 24px ${color}14` }}
      />

      {/* Icon */}
      <div
        className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${color}18`, color }}
      >
        <Icon size={28} />
      </div>

      {/* Badge */}
      {badge && (
        <div
          className="mb-3 inline-flex self-start rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest"
          style={{ background: `${color}18`, color }}
        >
          {badge}
        </div>
      )}

      <h2 className="mb-2 text-xl font-bold text-slate-100">{title}</h2>
      <p className="mb-5 flex-1 text-sm leading-relaxed text-slate-400">{description}</p>

      {/* Tags */}
      {tags && (
        <div className="mb-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag.label}
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                tag.active
                  ? "bg-accent/15 text-accent"
                  : "bg-slate-800/80 text-slate-500"
              }`}
            >
              {tag.active ? "✓ " : "◦ "}
              {tag.label}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      <Link
        href={href}
        className="btn-ripple flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-200"
        style={{
          background: `linear-gradient(135deg, ${color}cc, ${color}99)`,
          color: "#0c1017",
          boxShadow: `0 4px 20px ${color}30`
        }}
      >
        {cta}
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}

/* ── Feature chip ────────────────────────────────────── */
function FeatureChip({
  icon: Icon,
  title,
  description,
  color,
  delay
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  delay: number;
}) {
  return (
    <div
      className="reveal glass-card flex flex-col gap-3 rounded-xl p-5 transition-all duration-200 hover:border-opacity-60 hover:-translate-y-1"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className="flex h-9 w-9 items-center justify-center rounded-lg"
        style={{ background: `${color}18`, color }}
      >
        <Icon size={18} />
      </div>
      <div className="font-semibold text-slate-200">{title}</div>
      <p className="text-xs leading-relaxed text-slate-500">{description}</p>
    </div>
  );
}

/* ── Update item ─────────────────────────────────────── */
function UpdateItem({ date, label, desc }: { date: string; label: string; desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="h-2 w-2 rounded-full bg-accent mt-1.5 shrink-0" />
        <div className="w-px flex-1 bg-line mt-2" />
      </div>
      <div className="pb-5">
        <div className="text-xs text-slate-600 mb-0.5">{date}</div>
        <div className="text-sm font-semibold text-slate-200 mb-1">{label}</div>
        <div className="text-xs text-slate-500 leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   Main HomePage Component
════════════════════════════════════════════════════════ */
export function HomePage() {
  const parallax = useParallax();
  useReveal();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0c1017] text-slate-100">
      {/* ── Background blobs ─────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="animate-blob absolute rounded-full opacity-25"
          style={{
            width: 600,
            height: 600,
            left: "-10%",
            top: "-15%",
            background: "radial-gradient(circle, rgba(79,209,197,0.4) 0%, transparent 70%)",
            filter: "blur(60px)"
          }}
        />
        <div
          className="animate-blob absolute rounded-full opacity-20"
          style={{
            width: 500,
            height: 500,
            right: "-8%",
            top: "20%",
            background: "radial-gradient(circle, rgba(96,165,250,0.5) 0%, transparent 70%)",
            filter: "blur(70px)",
            animationDelay: "3s"
          }}
        />
        <div
          className="animate-blob absolute rounded-full opacity-15"
          style={{
            width: 400,
            height: 400,
            left: "35%",
            bottom: "10%",
            background: "radial-gradient(circle, rgba(167,139,250,0.5) 0%, transparent 70%)",
            filter: "blur(80px)",
            animationDelay: "6s"
          }}
        />
      </div>

      {/* ── Floating particles ────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {PARTICLES.map((p, i) => (
          <ParticleShape key={i} p={p} />
        ))}
      </div>

      {/* ── Header / Nav ─────────────────────────────── */}
      <header className="glass sticky top-0 z-50 border-b border-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-ink">
              <TrendingUp size={16} />
            </div>
            <span className="font-bold text-slate-100">PyVisuals</span>
          </div>
          <nav className="flex items-center gap-3">
            <Link
              href="/modules"
              className="hidden rounded-lg px-4 py-2 text-sm text-slate-400 transition-colors hover:text-slate-200 sm:inline-flex"
            >
              Modules
            </Link>
            <Link
              href="/compiler"
              className="hidden items-center gap-2 rounded-lg bg-accent/10 px-4 py-2 text-sm font-semibold text-accent hover:bg-accent/20 transition-colors sm:flex"
            >
              <Code2 size={14} />
              Compiler
            </Link>
            <AuthNavActions />
          </nav>
        </div>
      </header>

      <main>
        {/* ── Hero ─────────────────────────────────────── */}
        <section className="relative px-6 pt-24 pb-20 text-center">
          {/* Radial glow under text */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[500px]"
            style={{
              background:
                "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(79,209,197,0.10) 0%, transparent 80%)"
            }}
          />

          {/* Parallax container */}
          <div
            style={{
              transform: `translate(${parallax.x * 0.4}px, ${parallax.y * 0.3}px)`,
              transition: "transform 0.1s linear"
            }}
          >
            {/* Badge */}
            <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm text-accent">
              <Sparkles size={14} className="animate-pulse" />
              Interactive Python Learning Platform
            </div>

            {/* Title */}
            <h1
              className="animate-fade-up mb-5 text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl"
              style={{ animationDelay: "0.1s" }}
            >
              <span className="block text-slate-100">Visualize, Learn,</span>
              <span className="block gradient-text">and Master</span>
              <span className="block text-slate-100">Python Libraries</span>
            </h1>

            {/* Subtitle */}
            <p
              className="animate-fade-up mx-auto mb-10 max-w-xl text-lg text-slate-400"
              style={{ animationDelay: "0.25s" }}
            >
              A browser-native IDE with live visualizations and structured learning modules.
              No installation required — just open and start coding.
            </p>

            {/* Hero CTAs */}
            <div
              className="animate-fade-up flex flex-wrap items-center justify-center gap-4"
              style={{ animationDelay: "0.4s" }}
            >
              <Link
                href="/compiler"
                className="btn-ripple flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 font-semibold text-ink shadow-lg shadow-accent/20 transition-all hover:bg-[#78eee4] hover:shadow-accent/40 hover:-translate-y-0.5"
              >
                <Play size={16} />
                Start Coding
              </Link>
              <Link
                href="/modules"
                className="btn-ripple flex items-center gap-2 rounded-xl border border-line bg-panelSoft px-7 py-3.5 font-semibold text-slate-200 transition-all hover:border-accent hover:text-accent hover:-translate-y-0.5"
              >
                <BookOpen size={16} />
                Start Learning
              </Link>
            </div>
          </div>
        </section>

        {/* ── Action cards ─────────────────────────────── */}
        <section className="px-6 pb-20">
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
            <ActionCard
              href="/compiler"
              icon={Code2}
              color="#4fd1c5"
              title="Compiler"
              description="A full Python IDE in the browser. Write code, run it instantly, and see NumPy arrays, pandas DataFrames, and matplotlib charts visualised in real time."
              cta="Start Coding"
              badge="Live"
              tags={[
                { label: "Monaco Editor", active: true },
                { label: "NumPy Visualizer", active: true },
                { label: "Live Preview", active: true },
                { label: "Resizable Panels", active: true }
              ]}
            />
            <ActionCard
              href="/modules"
              icon={BookOpen}
              color="#60a5fa"
              title="Modules"
              description="Structured, interactive lessons with embedded code sandboxes, exercises, and quizzes. Go from zero to proficient with guided learning paths."
              cta="Start Learning"
              tags={[
                { label: "NumPy", active: true },
                { label: "Pandas", active: false },
                { label: "Matplotlib", active: false },
                { label: "Seaborn", active: false },
                { label: "SciPy", active: false }
              ]}
            />
          </div>
        </section>

        {/* ── Feature highlights ────────────────────────── */}
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-5xl">
            <div className="reveal mb-10 text-center">
              <h2 className="text-2xl font-bold text-slate-100 mb-2">Everything in one place</h2>
              <p className="text-slate-500">Designed for learners and practitioners alike</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <FeatureChip
                icon={Zap}
                title="Interactive Compiler"
                description="Full Monaco editor with syntax highlighting, auto-indent, and Ctrl+Enter to run."
                color="#4fd1c5"
                delay={0}
              />
              <FeatureChip
                icon={TrendingUp}
                title="Real-time Visualization"
                description="See NumPy arrays as colour-coded grids, DataFrames as tables, and plots as charts — live."
                color="#60a5fa"
                delay={100}
              />
              <FeatureChip
                icon={BookOpen}
                title="Learn by Doing"
                description="Every concept comes with an embedded code sandbox you can edit and run immediately."
                color="#a78bfa"
                delay={200}
              />
              <FeatureChip
                icon={LayoutTemplate}
                title="Structured Modules"
                description="Guided lessons with exercises, quizzes, and step-by-step explanations."
                color="#f59e0b"
                delay={300}
              />
            </div>
          </div>
        </section>

        {/* ── Stats ────────────────────────────────────── */}
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-3xl">
            <div className="reveal glass-card grid grid-cols-2 gap-8 rounded-2xl p-10 sm:grid-cols-4">
              <Counter to={5} label="Libraries (planned)" suffix="+" />
              <Counter to={13} label="NumPy Lessons" />
              <Counter to={8} label="Practice Exercises" />
              <Counter to={4} label="Visual Types" />
            </div>
          </div>
        </section>

        {/* ── What's New ───────────────────────────────── */}
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-3xl">
            <div className="reveal mb-8">
              <h2 className="text-2xl font-bold text-slate-100 mb-1">What&apos;s New</h2>
              <p className="text-sm text-slate-500">Recent updates and improvements</p>
            </div>
            <div className="reveal glass-card rounded-2xl p-6">
              <UpdateItem
                date="July 2026"
                label="Learning Platform Launch"
                desc="Full NumPy module with 13 interactive lessons, exercises, quizzes, and embedded code sandboxes."
              />
              <UpdateItem
                date="July 2026"
                label="Resizable Panels"
                desc="Drag to resize the editor, visualizer, and terminal. Sizes persist across sessions."
              />
              <UpdateItem
                date="July 2026"
                label="Decoupled Visualizer"
                desc="The live visualizer now operates completely independently from terminal print output."
              />
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-slate-700 mt-1.5 shrink-0" />
                </div>
                <div className="pb-2">
                  <div className="text-xs text-slate-600 mb-0.5">Coming soon</div>
                  <div className="text-sm font-semibold text-slate-500">Pandas &amp; Matplotlib Modules</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Code snippet preview ─────────────────────── */}
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-3xl">
            <div className="reveal glass-card overflow-hidden rounded-2xl border border-line/60">
              <div className="flex items-center gap-2 border-b border-line bg-[#111722] px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/60" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                  <div className="h-3 w-3 rounded-full bg-green-500/60" />
                </div>
                <span className="text-xs text-slate-600 ml-2">python · browser</span>
              </div>
              <pre className="overflow-auto p-6 font-mono text-sm leading-7 text-slate-300">
                <span className="text-slate-600">{"# No installation. Just open and code."}</span>{"\n"}
                <span className="text-violet">import</span>{" "}
                <span className="text-accent">numpy</span>{" "}
                <span className="text-violet">as</span>{" np\n\n"}
                <span className="text-slate-400">data</span>{" = np."}
                <span className="text-yellow-400">array</span>
                {"([[1, 2, 3],\n         [4, 5, 6]])\n\n"}
                <span className="text-slate-400">result</span>{" = data"}
                <span className="text-slate-300">{" * 2 + np."}</span>
                <span className="text-yellow-400">ones</span>
                {"((2, 3))\n"}
                <span className="text-slate-600">{"# ↑ Visualizes instantly in the panel →"}</span>
              </pre>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className="border-t border-line bg-[#0a0e17]">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <TrendingUp size={14} />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-300">PyVisuals</span>
                <span className="ml-2 text-xs text-slate-600">v0.2.0</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-600">
              <Terminal size={11} />
              Powered by Pyodide · Runs 100% in your browser
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-slate-300 transition-colors"
              >
                <Github size={13} />
                GitHub
              </a>
              <a
                href="https://pyodide.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-slate-300 transition-colors"
              >
                <ExternalLink size={11} />
                Pyodide Docs
              </a>
              <a
                href="https://numpy.org/doc"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-slate-300 transition-colors"
              >
                <ExternalLink size={11} />
                NumPy Docs
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
