"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { ArrayCellValue, ArrayVisual, ChartVisual, TableVisual, VisualPayload } from "@/lib/types";

type VisualizerPanelProps = {
  visuals: VisualPayload[];
  updating: boolean;
  ready: boolean;
};

const COLORS = ["#4fd1c5", "#f59e0b", "#60a5fa", "#f472b6", "#a3e635", "#fb7185"];

export function VisualizerPanel({ visuals, updating, ready }: VisualizerPanelProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col border-b border-line bg-panel">
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-line px-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">Live Visualizer</h2>
          <p className="text-xs text-slate-400">Jupyter-style last value and explicit display calls</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          {updating ? <span className="h-2 w-2 animate-pulse rounded-full bg-accent" /> : null}
          <span>{!ready ? "loading..." : updating ? "updating..." : "live"}</span>
        </div>
      </div>
      <div className="table-scrollbar min-h-0 flex-1 overflow-auto p-4">
        {visuals.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            Visual output appears here as you type.
          </div>
        ) : (
          <div className="space-y-4">
            {visuals.map((visual, index) => (
              <VisualCard key={`${visual.kind}-${index}`} visual={visual} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function VisualCard({ visual }: { visual: VisualPayload }) {
  if (visual.kind === "array") {
    return <ArrayDiagram visual={visual} />;
  }

  if (visual.kind === "table") {
    return <SortableTable visual={visual} />;
  }

  if (visual.kind === "chart") {
    return <NativeChart visual={visual} />;
  }

  return (
    <div className="rounded-md border border-line bg-panelSoft p-4">
      <div className="mb-2 text-sm font-semibold text-slate-100">{visual.title}</div>
      <pre className="whitespace-pre-wrap break-words font-mono text-sm text-slate-300">{visual.text}</pre>
    </div>
  );
}

function ArrayDiagram({ visual }: { visual: ArrayVisual }) {
  const rank = visual.shape.length;
  const values = visual.values;
  const isWarm = /ones|zeros|random/i.test(visual.title);
  const stats = getNumberStats(values);
  const meta = [
    `shape (${visual.shape.join(", ")})`,
    visual.dtype,
    visual.projected ? "3D preview" : null,
    visual.truncated ? "preview" : null
  ].filter(Boolean);

  return (
    <div className="overflow-hidden rounded-md border border-line bg-[#f8fafc] text-ink shadow-sm">
      <div className="flex min-h-12 items-center justify-between gap-3 border-b border-[#d2d8e2] bg-white px-4 py-2">
        <div className="min-w-0">
          <div className="truncate font-mono text-sm font-semibold">
            <CodeExpression expression={visual.title} />
          </div>
          <div className="text-xs text-slate-500">{meta.join(" / ")}</div>
        </div>
        <div className="rounded-sm bg-[#e8f7ff] px-2 py-1 text-xs font-semibold text-[#2087c9]">
          NumPy {rank}D
        </div>
      </div>

      {rank <= 1 ? (
        <div className="flex min-h-[220px] items-center justify-center gap-8 overflow-auto p-8">
          <CodePill expression={visual.title} />
          <Arrow />
          <VectorStack values={asVector(values)} stats={stats} warm={isWarm} />
        </div>
      ) : rank === 2 ? (
        <div className="flex min-h-[260px] items-center justify-center overflow-auto p-8">
          <MatrixBlock label={visual.title} matrix={asMatrix(values)} stats={stats} warm={isWarm} />
        </div>
      ) : (
        <div className="min-h-[320px] overflow-auto p-8">
          <LayeredArray visual={visual} stats={stats} warm={isWarm} />
        </div>
      )}
    </div>
  );
}

function CodeExpression({ expression }: { expression: string }) {
  const npMatch = expression.match(/^(np\.)([A-Za-z_][\w]*)(.*)$/);
  if (!npMatch) {
    return <span>{expression}</span>;
  }

  return (
    <>
      <span>{npMatch[1]}</span>
      <span className="text-[#f97316]">{npMatch[2]}</span>
      <span>{npMatch[3]}</span>
    </>
  );
}

function CodePill({ expression }: { expression: string }) {
  return (
    <div className="max-w-[260px] truncate font-mono text-lg font-bold text-black">
      <CodeExpression expression={expression} />
    </div>
  );
}

function Arrow() {
  return (
    <div className="relative h-10 w-16 shrink-0">
      <div className="absolute left-0 top-1/2 h-4 w-9 -translate-y-1/2 bg-[#2d9bf0]" />
      <div className="absolute right-0 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[20px] border-l-[28px] border-y-transparent border-l-[#2d9bf0]" />
    </div>
  );
}

function VectorStack({
  values,
  stats,
  warm
}: {
  values: ArrayCellValue[];
  stats: NumberStats;
  warm: boolean;
}) {
  return (
    <div className="grid min-w-[92px] overflow-hidden border border-[#aeb7c4]">
      {values.map((value, index) => (
        <ArrayCell key={index} value={value} stats={stats} warm={warm} />
      ))}
    </div>
  );
}

function MatrixBlock({
  label,
  matrix,
  stats,
  warm
}: {
  label: string;
  matrix: ArrayCellValue[][];
  stats: NumberStats;
  warm: boolean;
}) {
  const columnCount = Math.max(1, ...matrix.map((row) => row.length));

  return (
    <div className="inline-flex flex-col items-center gap-3">
      <div className="font-mono text-xl font-bold text-[#2087c9]">{labelName(label)}</div>
      <div
        className="grid overflow-hidden border border-[#aeb7c4]"
        style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(58px, 76px))` }}
      >
        {matrix.flatMap((row, rowIndex) =>
          Array.from({ length: columnCount }, (_, colIndex) => (
            <ArrayCell
              key={`${rowIndex}-${colIndex}`}
              value={row[colIndex] ?? null}
              stats={stats}
              warm={warm}
            />
          ))
        )}
      </div>
    </div>
  );
}

function LayeredArray({
  visual,
  stats,
  warm
}: {
  visual: ArrayVisual;
  stats: NumberStats;
  warm: boolean;
}) {
  const layers = asLayers(visual.values);

  return (
    <div className="flex min-w-max items-center justify-center gap-8">
      <CodePill expression={visual.title} />
      <Arrow />
      <div className="relative min-h-[220px] min-w-[320px]">
        {layers.map((layer, index) => (
          <div
            key={index}
            className="absolute left-0 top-0 rounded-sm border border-[#97a4b5] bg-white shadow-[12px_12px_0_rgba(15,23,42,0.08)]"
            style={{
              transform: `translate(${index * 30}px, ${index * 24}px)`,
              zIndex: layers.length - index
            }}
          >
            <div className="border-b border-[#c9d2df] bg-[#eef7fc] px-2 py-1 font-mono text-xs font-semibold text-[#2087c9]">
              layer {index}
            </div>
            <MatrixGrid matrix={layer} stats={stats} warm={warm} />
          </div>
        ))}
      </div>
    </div>
  );
}

function MatrixGrid({
  matrix,
  stats,
  warm
}: {
  matrix: ArrayCellValue[][];
  stats: NumberStats;
  warm: boolean;
}) {
  const columnCount = Math.max(1, ...matrix.map((row) => row.length));

  return (
    <div
      className="grid overflow-hidden"
      style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(48px, 64px))` }}
    >
      {matrix.flatMap((row, rowIndex) =>
        Array.from({ length: columnCount }, (_, colIndex) => (
          <ArrayCell
            key={`${rowIndex}-${colIndex}`}
            compact
            value={row[colIndex] ?? null}
            stats={stats}
            warm={warm}
          />
        ))
      )}
    </div>
  );
}

function ArrayCell({
  compact,
  stats,
  value,
  warm
}: {
  compact?: boolean;
  stats: NumberStats;
  value: ArrayCellValue;
  warm: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-center border-b border-r border-[#aeb7c4] font-mono font-semibold text-black last:border-b-0 ${
        compact ? "h-11 min-w-12 text-sm" : "h-14 min-w-[58px] text-xl"
      }`}
      style={{ backgroundColor: cellColor(value, stats, warm) }}
      title={String(value ?? "")}
    >
      <span className="max-w-full truncate px-2">{formatArrayValue(value)}</span>
    </div>
  );
}

type NumberStats = {
  min: number;
  max: number;
  hasNumbers: boolean;
};

function getNumberStats(values: ArrayVisual["values"]): NumberStats {
  const numbers = flattenValues(values).filter((value): value is number => typeof value === "number");
  if (!numbers.length) {
    return { min: 0, max: 0, hasNumbers: false };
  }

  return {
    min: Math.min(...numbers),
    max: Math.max(...numbers),
    hasNumbers: true
  };
}

function flattenValues(values: ArrayVisual["values"]): ArrayCellValue[] {
  if (!Array.isArray(values)) {
    return [];
  }

  return values.flat(3) as ArrayCellValue[];
}

function cellColor(value: ArrayCellValue, stats: NumberStats, warm: boolean) {
  if (typeof value !== "number" || !stats.hasNumbers) {
    return "#e8eef5";
  }

  const span = stats.max - stats.min;
  const ratio = span === 0 ? 0.45 : Math.max(0, Math.min(1, (value - stats.min) / span));
  if (warm) {
    const lightness = 91 - ratio * 18;
    return `hsl(38 94% ${lightness}%)`;
  }

  const lightness = 92 - ratio * 40;
  return `hsl(196 82% ${lightness}%)`;
}

function formatArrayValue(value: ArrayCellValue) {
  if (value === null) {
    return "";
  }

  if (typeof value === "number") {
    if (Number.isInteger(value)) {
      return String(value);
    }
    return value.toPrecision(4).replace(/\.?0+$/, "");
  }

  return String(value);
}

function asVector(values: ArrayVisual["values"]) {
  if (!Array.isArray(values)) {
    return [];
  }

  return values.filter((value): value is ArrayCellValue => !Array.isArray(value));
}

function asMatrix(values: ArrayVisual["values"]) {
  if (!Array.isArray(values)) {
    return [];
  }

  return values.filter((row): row is ArrayCellValue[] => Array.isArray(row) && !Array.isArray(row[0]));
}

function asLayers(values: ArrayVisual["values"]) {
  if (!Array.isArray(values)) {
    return [];
  }

  return values.filter((layer): layer is ArrayCellValue[][] => Array.isArray(layer) && Array.isArray(layer[0]));
}

function labelName(title: string) {
  const assignment = title.match(/^([A-Za-z_]\w*)\s*=/);
  if (assignment) {
    return assignment[1];
  }

  if (/^[A-Za-z_]\w*$/.test(title)) {
    return title;
  }

  return "array";
}

function SortableTable({ visual }: { visual: TableVisual }) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [ascending, setAscending] = useState(true);

  const rows = useMemo(() => {
    if (!sortKey) {
      return visual.rows;
    }

    return [...visual.rows].sort((a, b) => {
      const left = a[sortKey];
      const right = b[sortKey];
      const leftNumber = typeof left === "number" ? left : Number(left);
      const rightNumber = typeof right === "number" ? right : Number(right);

      if (Number.isFinite(leftNumber) && Number.isFinite(rightNumber)) {
        return ascending ? leftNumber - rightNumber : rightNumber - leftNumber;
      }

      const result = String(left ?? "").localeCompare(String(right ?? ""));
      return ascending ? result : -result;
    });
  }, [ascending, sortKey, visual.rows]);

  function toggleSort(key: string) {
    if (sortKey === key) {
      setAscending((value) => !value);
      return;
    }

    setSortKey(key);
    setAscending(true);
  }

  return (
    <div className="overflow-hidden rounded-md border border-line bg-panelSoft">
      <div className="flex h-10 items-center justify-between border-b border-line px-3">
        <div className="text-sm font-semibold text-slate-100">{visual.title}</div>
        <div className="text-xs text-slate-400">
          {visual.shape ? `shape (${visual.shape.join(", ")})` : null}
          {visual.truncated ? " / first 250 rows" : null}
        </div>
      </div>
      <div className="table-scrollbar max-h-[360px] overflow-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 bg-[#222a38] text-xs uppercase tracking-[0.08em] text-slate-300">
            <tr>
              {visual.columns.map((column) => (
                <th key={column.key} className="border-b border-line px-3 py-2">
                  <button
                    className="flex w-full items-center justify-between gap-3 text-left"
                    onClick={() => toggleSort(column.key)}
                    type="button"
                  >
                    <span>{column.label}</span>
                    <span className="text-slate-500">
                      {sortKey === column.key ? (ascending ? "asc" : "desc") : ""}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-[#293244] last:border-b-0">
                {visual.columns.map((column) => (
                  <td key={column.key} className="max-w-[260px] truncate px-3 py-2 text-slate-200">
                    {String(row[column.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NativeChart({ visual }: { visual: ChartVisual }) {
  const chartData = useMemo(() => mergeSeries(visual), [visual]);

  return (
    <div className="rounded-md border border-line bg-panelSoft p-3">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-100">{visual.title}</div>
          <div className="text-xs text-slate-400">
            {[visual.xLabel, visual.yLabel].filter(Boolean).join(" / ")}
          </div>
        </div>
        <div className="text-xs uppercase tracking-[0.1em] text-accent">{visual.chartType}</div>
      </div>
      <div className="h-[340px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          {visual.chartType === "scatter" ? (
            <ScatterChart margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
              <CartesianGrid stroke="#2f394a" />
              <XAxis dataKey="x" name={visual.xLabel || "x"} stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis dataKey="y" name={visual.yLabel || "y" } stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#151922", border: "1px solid #2f394a" }} />
              <Legend />
              {visual.series.map((series, index) => (
                <Scatter
                  key={series.name}
                  data={series.data}
                  fill={COLORS[index % COLORS.length]}
                  name={series.name}
                />
              ))}
            </ScatterChart>
          ) : visual.chartType === "bar" || visual.chartType === "hist" ? (
            <BarChart data={chartData} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
              <CartesianGrid stroke="#2f394a" />
              <XAxis dataKey="x" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#151922", border: "1px solid #2f394a" }} />
              <Legend />
              {visual.series.map((series, index) => (
                <Bar key={series.name} dataKey={series.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </BarChart>
          ) : (
            <LineChart data={chartData} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
              <CartesianGrid stroke="#2f394a" />
              <XAxis dataKey="x" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#151922", border: "1px solid #2f394a" }} />
              <Legend />
              {visual.series.map((series, index) => (
                <Line
                  key={series.name}
                  dataKey={series.name}
                  dot={false}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  type="monotone"
                />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function mergeSeries(visual: ChartVisual) {
  const rows = new Map<string | number, Record<string, string | number | null>>();

  for (const series of visual.series) {
    for (const point of series.data) {
      const row = rows.get(point.x) ?? { x: point.x };
      row[series.name] = point.y;
      rows.set(point.x, row);
    }
  }

  return Array.from(rows.values());
}
