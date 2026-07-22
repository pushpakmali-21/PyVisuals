"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { LogOut, User, ChevronDown, Code2, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// ── Auth-aware navigation actions ────────────────────────────────
// Used in all page headers to show sign-in/sign-up or user menu.

export function AuthNavActions() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  if (loading) {
    return (
      <div className="h-8 w-24 animate-pulse rounded-lg bg-white/5" />
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="rounded-lg px-4 py-2 text-sm text-slate-400 transition-colors hover:text-slate-200"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="btn-ripple flex items-center gap-1.5 rounded-lg bg-accent/10 px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  // Logged in — show avatar dropdown
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setDropdownOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-line bg-panelSoft px-3 py-1.5 text-sm text-slate-300 transition-all hover:border-accent/40 hover:text-slate-100"
        aria-label="User menu"
      >
        {/* Avatar */}
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-[11px] font-bold text-accent select-none">
          {initials}
        </span>
        <span className="hidden max-w-[100px] truncate sm:inline">{user.name}</span>
        <ChevronDown
          size={13}
          className={`shrink-0 text-slate-500 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 w-52 overflow-hidden rounded-xl border border-white/8 glass-card shadow-2xl animate-fade-in">
          {/* User info */}
          <div className="border-b border-line/60 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                {initials}
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-100">{user.name}</div>
                <div className="truncate text-xs text-slate-500">{user.email}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="py-1.5">
            <Link
              href="/compiler"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-white/4 hover:text-slate-200"
            >
              <Code2 size={14} />
              Compiler
            </Link>
            <Link
              href="/modules"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-white/4 hover:text-slate-200"
            >
              <TrendingUp size={14} />
              My Progress
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-line/60 py-1.5">
            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false);
                logout();
                router.push("/");
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-red-500/8 hover:text-red-400"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
