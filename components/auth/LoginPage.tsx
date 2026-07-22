"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// ── Background blobs (reuse HomePage pattern) ────────────────────
function AuthBlobs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div
        className="animate-blob absolute rounded-full opacity-25"
        style={{
          width: 600,
          height: 600,
          left: "-10%",
          top: "-15%",
          background: "radial-gradient(circle, rgba(79,209,197,0.4) 0%, transparent 70%)",
          filter: "blur(60px)",
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
          animationDelay: "3s",
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
          animationDelay: "6s",
        }}
      />
    </div>
  );
}

// ── Input field ──────────────────────────────────────────────────
function AuthInput({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  icon: Icon,
  rightSlot,
  error,
  autoComplete,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon: React.ElementType;
  rightSlot?: React.ReactNode;
  error?: string;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-300">
        {label}
      </label>
      <div className="relative">
        <Icon
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          id={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-panelSoft py-3 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-200
            focus:ring-2 focus:ring-accent/30
            ${error
              ? "border-red-500/60 focus:border-red-500"
              : "border-line focus:border-accent/60"
            }
            ${rightSlot ? "pr-11" : ""}`}
        />
        {rightSlot && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
        )}
      </div>
      {error && (
        <p className="animate-fade-in text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Login Page
// ════════════════════════════════════════════════════════════════
export function LoginPage() {
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) router.replace("/");
  }, [user, authLoading, router]);

  function validate(): boolean {
    const errs: typeof fieldErrors = {};
    if (!email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email.";
    if (!password) errs.password = "Password is required.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      router.push("/");
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0c1017] text-slate-100">
      <AuthBlobs />

      {/* Nav */}
      <header className="glass sticky top-0 z-50 border-b border-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-ink">
              <TrendingUp size={16} />
            </div>
            <span className="font-bold text-slate-100">PyVisuals</span>
          </Link>
          <div className="text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-accent hover:text-accent/80 transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="relative z-10 flex min-h-[calc(100vh-65px)] items-center justify-center px-6 py-16">
        {/* Radial glow */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[400px]"
          style={{
            background:
              "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(79,209,197,0.08) 0%, transparent 80%)",
          }}
        />

        <div className="w-full max-w-md animate-fade-up">
          {/* Card */}
          <div className="glass-card rounded-2xl border border-white/7 p-8 shadow-2xl">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm text-accent">
                <Sparkles size={13} className="animate-pulse" />
                Welcome back
              </div>
              <h1 className="text-2xl font-black text-slate-100">Sign in to PyVisuals</h1>
              <p className="mt-2 text-sm text-slate-500">
                Continue your Python learning journey
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              <AuthInput
                id="login-email"
                label="Email address"
                type="email"
                value={email}
                onChange={(v) => { setEmail(v); setFieldErrors((e) => ({ ...e, email: undefined })); }}
                placeholder="you@example.com"
                icon={Mail}
                error={fieldErrors.email}
                autoComplete="email"
              />

              <AuthInput
                id="login-password"
                label="Password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(v) => { setPassword(v); setFieldErrors((e) => ({ ...e, password: undefined })); }}
                placeholder="••••••••"
                icon={Lock}
                error={fieldErrors.password}
                autoComplete="current-password"
                rightSlot={
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPw((v) => !v)}
                    className="text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              {/* Global error */}
              {error && (
                <div className="animate-fade-in flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-400">
                  <span className="mt-0.5 shrink-0">⚠</span>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-ripple mt-1 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-ink shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-accent/40 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                style={{
                  background: loading
                    ? "rgba(79,209,197,0.4)"
                    : "linear-gradient(135deg, #4fd1c5, #60a5fa)",
                  boxShadow: "0 4px 20px rgba(79,209,197,0.25)",
                }}
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              New to PyVisuals?{" "}
              <Link href="/signup" className="font-semibold text-accent hover:text-accent/80 transition-colors">
                Create a free account
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
