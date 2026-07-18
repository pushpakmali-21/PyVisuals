export type TerminalStream = "stdout" | "stderr";

export type TerminalLine = {
  stream: TerminalStream;
  text: string;
};

export type TableVisual = {
  kind: "table";
  title: string;
  columns: Array<{ key: string; label: string }>;
  rows: Array<Record<string, string | number | boolean | null>>;
  shape?: [number, number] | [number];
  truncated?: boolean;
};

export type ChartVisual = {
  kind: "chart";
  chartType: "line" | "bar" | "scatter" | "hist";
  title: string;
  xLabel?: string;
  yLabel?: string;
  series: Array<{
    name: string;
    data: Array<{ x: string | number; y: number | null }>;
  }>;
};

export type ArrayCellValue = string | number | boolean | null;

export type ArrayVisual = {
  kind: "array";
  title: string;
  shape: number[];
  dtype: string;
  values:
    | ArrayCellValue[]
    | ArrayCellValue[][]
    | ArrayCellValue[][][];
  truncated?: boolean;
  projected?: boolean;
};

export type TextVisual = {
  kind: "text";
  title: string;
  text: string;
};

export type EmptyVisual = {
  kind: "empty";
  title: string;
  text: string;
};

export type VisualPayload = TableVisual | ChartVisual | ArrayVisual | TextVisual | EmptyVisual;

export type ExecutionResult = {
  ok: boolean;
  visuals: VisualPayload[];
  terminal: TerminalLine[];
  error?: string;
};
