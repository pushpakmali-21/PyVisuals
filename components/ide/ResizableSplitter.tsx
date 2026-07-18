"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ────────────────────────────────────────────────────────────
   ResizableSplitter
   – direction="horizontal"  → drag left/right (resize columns)
   – direction="vertical"    → drag up/down   (resize rows)
   Persists size of the *first* panel to localStorage.
──────────────────────────────────────────────────────────── */

type SplitterProps = {
  direction: "horizontal" | "vertical";
  /** localStorage key to persist the first-panel size (px) */
  storageKey: string;
  /** Initial size of the first panel in px */
  initialSize: number;
  /** Min size of first panel */
  minFirst?: number;
  /** Min size of second panel */
  minSecond?: number;
  /** Container element ref (defaults to the splitter's parentElement) */
  containerRef?: React.RefObject<HTMLElement>;
  children: [React.ReactNode, React.ReactNode];
};

export function ResizableSplitter({
  direction,
  storageKey,
  initialSize,
  minFirst = 200,
  minSecond = 160,
  containerRef,
  children
}: SplitterProps) {
  const isH = direction === "horizontal";

  const [firstSize, setFirstSize] = useState<number>(() => {
    if (typeof window === "undefined") return initialSize;
    const saved = localStorage.getItem(storageKey);
    return saved ? Number(saved) : initialSize;
  });

  const splitterRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startPos = useRef(0);
  const startSize = useRef(0);

  const clamp = useCallback(
    (value: number, containerSize: number) =>
      Math.max(minFirst, Math.min(value, containerSize - minSecond - 5)),
    [minFirst, minSecond]
  );

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragging.current = true;
      startPos.current = isH ? e.clientX : e.clientY;
      startSize.current = firstSize;
      splitterRef.current?.classList.add("dragging");

      const onMove = (moveEvent: MouseEvent) => {
        if (!dragging.current) return;
        const delta = isH
          ? moveEvent.clientX - startPos.current
          : moveEvent.clientY - startPos.current;
        const container = containerRef?.current ?? splitterRef.current?.parentElement;
        const containerSize = container
          ? isH ? container.offsetWidth : container.offsetHeight
          : 9999;
        const next = clamp(startSize.current + delta, containerSize);
        setFirstSize(next);
      };

      const onUp = () => {
        dragging.current = false;
        splitterRef.current?.classList.remove("dragging");
        setFirstSize((s) => {
          localStorage.setItem(storageKey, String(s));
          return s;
        });
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [isH, firstSize, clamp, storageKey, containerRef]
  );

  /* touch support */
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      dragging.current = true;
      startPos.current = isH ? touch.clientX : touch.clientY;
      startSize.current = firstSize;
      splitterRef.current?.classList.add("dragging");

      const onMove = (te: TouchEvent) => {
        if (!dragging.current) return;
        const t = te.touches[0];
        const delta = isH ? t.clientX - startPos.current : t.clientY - startPos.current;
        const container = containerRef?.current ?? splitterRef.current?.parentElement;
        const containerSize = container
          ? isH ? container.offsetWidth : container.offsetHeight
          : 9999;
        const next = clamp(startSize.current + delta, containerSize);
        setFirstSize(next);
      };

      const onEnd = () => {
        dragging.current = false;
        splitterRef.current?.classList.remove("dragging");
        setFirstSize((s) => {
          localStorage.setItem(storageKey, String(s));
          return s;
        });
        window.removeEventListener("touchmove", onMove);
        window.removeEventListener("touchend", onEnd);
      };

      window.addEventListener("touchmove", onMove, { passive: false });
      window.addEventListener("touchend", onEnd);
    },
    [isH, firstSize, clamp, storageKey, containerRef]
  );

  if (isH) {
    return (
      <div className="flex min-h-0 flex-1 overflow-hidden" style={{ flexDirection: "row" }}>
        <div style={{ width: firstSize, flexShrink: 0, minWidth: minFirst, overflow: "hidden", height: "100%" }} className="flex flex-col min-h-0">
          {children[0]}
        </div>
        <div
          ref={splitterRef}
          className="splitter-h select-none"
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          role="separator"
          aria-orientation="vertical"
          tabIndex={-1}
        />
        <div style={{ flex: 1, minWidth: minSecond, overflow: "hidden" }} className="flex flex-col min-h-0">
          {children[1]}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div style={{ height: firstSize, flexShrink: 0, minHeight: minFirst, overflow: "hidden" }} className="flex flex-col">
        {children[0]}
      </div>
      <div
        ref={splitterRef}
        className="splitter-v select-none"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        role="separator"
        aria-orientation="horizontal"
        tabIndex={-1}
      />
      <div style={{ flex: 1, minHeight: minSecond, overflow: "hidden" }} className="flex flex-col">
        {children[1]}
      </div>
    </div>
  );
}
