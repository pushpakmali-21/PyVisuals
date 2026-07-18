import type { ExecutionResult } from "./types";

type PyodideLike = {
  loadPackage: (packages: string[] | string) => Promise<void>;
  runPythonAsync: (code: string) => Promise<unknown>;
  globals: {
    set: (key: string, value: unknown) => void;
    delete: (key: string) => void;
  };
};

declare global {
  interface Window {
    loadPyodide?: (options: { indexURL: string }) => Promise<PyodideLike>;
  }
}

const PYODIDE_VERSION = "0.26.4";
const PYODIDE_BASE_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

let pyodidePromise: Promise<PyodideLike> | null = null;
let executionQueue = Promise.resolve();

export function ensurePyodide(onStatus?: (message: string) => void) {
  if (!pyodidePromise) {
    pyodidePromise = loadPyodideRuntime(onStatus);
  }

  return pyodidePromise;
}

export async function executePython(
  code: string,
  mode: "live" | "run",
  onStatus?: (message: string) => void
): Promise<ExecutionResult> {
  const pyodide = await ensurePyodide(onStatus);

  return enqueue(async () => {
    const codeKey = `__PYVISUALS_CODE_${mode.toUpperCase()}__`;
    pyodide.globals.set(codeKey, code);
    pyodide.globals.set("__PYVISUALS_CODE_KEY__", codeKey);
    pyodide.globals.set("__PYVISUALS_MODE__", mode);

    try {
      const result = await pyodide.runPythonAsync(PYTHON_EXECUTOR);
      return JSON.parse(String(result)) as ExecutionResult;
    } finally {
      pyodide.globals.delete(codeKey);
      pyodide.globals.delete("__PYVISUALS_CODE_KEY__");
      pyodide.globals.delete("__PYVISUALS_MODE__");
    }
  });
}

async function loadPyodideRuntime(onStatus?: (message: string) => void) {
  onStatus?.("Loading Pyodide runtime");
  await appendScript(`${PYODIDE_BASE_URL}pyodide.js`);

  if (!window.loadPyodide) {
    throw new Error("Pyodide loader did not initialize.");
  }

  const pyodide = await window.loadPyodide({ indexURL: PYODIDE_BASE_URL });
  onStatus?.("Installing NumPy, Pandas, and Matplotlib");
  await pyodide.loadPackage(["numpy", "pandas", "matplotlib"]);
  onStatus?.("Python runtime ready");
  return pyodide;
}

function appendScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
      } else {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), {
          once: true
        });
      }
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.loaded = "false";
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

function enqueue<T>(task: () => Promise<T>) {
  const run = executionQueue.then(task, task);
  executionQueue = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

const PYTHON_EXECUTOR = String.raw`
import ast
import json
import sys
import traceback

_code = globals()[globals()["__PYVISUALS_CODE_KEY__"]]
_mode = globals().get("__PYVISUALS_MODE__", "live")
_captures = []
_terminal = []

def _json_value(value):
    try:
        import math
        import numpy as np
        import pandas as pd
    except Exception:
        np = None
        pd = None

    if value is None:
        return None
    if isinstance(value, (str, bool, int)):
        return value
    if isinstance(value, float):
        return value if math.isfinite(value) else None
    if np is not None and isinstance(value, np.generic):
        return _json_value(value.item())
    if pd is not None and not isinstance(value, (list, tuple, dict)) and pd.isna(value):
        return None
    if hasattr(value, "isoformat"):
        try:
            return value.isoformat()
        except Exception:
            pass
    if isinstance(value, (list, tuple)):
        return [_json_value(item) for item in value]
    if isinstance(value, dict):
        return {str(key): _json_value(item) for key, item in value.items()}
    return str(value)

def _to_number(value):
    try:
        import math
        import numpy as np
        if isinstance(value, np.generic):
            value = value.item()
        value = float(value)
        return value if math.isfinite(value) else None
    except Exception:
        return None

def _sequence(value):
    try:
        import numpy as np
        arr = np.asarray(value, dtype=object).reshape(-1).tolist()
        return [_json_value(item) for item in arr]
    except Exception:
        if isinstance(value, range):
            return list(value)
        if isinstance(value, (list, tuple)):
            return [_json_value(item) for item in value]
        return [_json_value(value)]

def _xy_series(x_values, y_values, name="series"):
    x_seq = _sequence(x_values)
    y_seq = _sequence(y_values)
    count = min(len(x_seq), len(y_seq))
    return {
        "name": str(name or "series"),
        "data": [
            {"x": x_seq[index], "y": _to_number(y_seq[index])}
            for index in range(count)
        ]
    }

def _table_from_dataframe(obj, title):
    limit = 250
    columns = [{"key": "__index__", "label": "index"}]
    columns.extend({"key": str(col), "label": str(col)} for col in obj.columns)
    rows = []
    sample = obj.head(limit)
    for index, row in sample.iterrows():
        item = {"__index__": str(index)}
        for col in obj.columns:
            item[str(col)] = _json_value(row[col])
        rows.append(item)
    return {
        "kind": "table",
        "title": title,
        "columns": columns,
        "rows": rows,
        "shape": [int(obj.shape[0]), int(obj.shape[1])],
        "truncated": len(obj) > limit
    }

def _table_from_series(obj, title):
    limit = 250
    rows = [
        {"index": str(index), "value": _json_value(value)}
        for index, value in obj.head(limit).items()
    ]
    return {
        "kind": "table",
        "title": title,
        "columns": [{"key": "index", "label": "index"}, {"key": "value", "label": str(obj.name or "value")}],
        "rows": rows,
        "shape": [int(obj.shape[0])],
        "truncated": len(obj) > limit
    }

def _array_from_array(obj, title):
    import numpy as np
    arr = np.asarray(obj)
    if arr.ndim == 0:
        return {"kind": "text", "title": title, "text": str(_json_value(arr.item()))}

    projected = False
    if arr.size == 0:
        values = [] if arr.ndim == 1 else [[]]
        truncated = False
    elif arr.ndim == 1:
        sample = arr[:24]
        values = _json_value(sample.tolist())
        truncated = arr.shape[0] > sample.shape[0]
    elif arr.ndim == 2:
        sample = arr[:12, :12]
        values = _json_value(sample.tolist())
        truncated = arr.shape[0] > sample.shape[0] or arr.shape[1] > sample.shape[1]
    else:
        if arr.ndim == 3:
            projected_array = arr
        else:
            projected = True
            projected_array = arr.reshape((arr.shape[0], arr.shape[1], -1))
        sample = projected_array[:4, :8, :8]
        values = _json_value(sample.tolist())
        truncated = (
            projected
            or projected_array.shape[0] > sample.shape[0]
            or projected_array.shape[1] > sample.shape[1]
            or projected_array.shape[2] > sample.shape[2]
        )

    return {
        "kind": "array",
        "title": title,
        "shape": [int(dim) for dim in arr.shape],
        "dtype": str(arr.dtype),
        "values": values,
        "truncated": truncated,
        "projected": projected
    }

def _table_from_array(obj, title):
    import numpy as np
    arr = np.asarray(obj)
    limit = 250
    if arr.ndim == 0:
        return {"kind": "text", "title": title, "text": str(_json_value(arr.item()))}
    if arr.ndim == 1:
        rows = [{"index": index, "value": _json_value(value)} for index, value in enumerate(arr[:limit])]
        columns = [{"key": "index", "label": "index"}, {"key": "value", "label": "value"}]
    else:
        sample = arr.reshape((arr.shape[0], -1))[:limit]
        columns = [{"key": "__index__", "label": "row"}]
        columns.extend({"key": str(index), "label": str(index)} for index in range(sample.shape[1]))
        rows = []
        for row_index, row in enumerate(sample):
            item = {"__index__": row_index}
            for col_index, value in enumerate(row):
                item[str(col_index)] = _json_value(value)
            rows.append(item)
    return {
        "kind": "table",
        "title": title,
        "columns": columns,
        "rows": rows,
        "shape": [int(dim) for dim in arr.shape],
        "truncated": arr.shape[0] > limit
    }

def _chart_from_current_figure():
    try:
        import matplotlib.pyplot as plt
        return _chart_from_figure(plt.gcf(), "matplotlib figure")
    except Exception:
        return None

def _chart_from_figure(fig, title="matplotlib figure"):
    try:
        axes = fig.get_axes()
    except Exception:
        return None

    series = []
    chart_type = "line"
    x_label = ""
    y_label = ""
    chart_title = title

    for ax_index, ax in enumerate(axes):
        if ax.get_title():
            chart_title = ax.get_title()
        if ax.get_xlabel():
            x_label = ax.get_xlabel()
        if ax.get_ylabel():
            y_label = ax.get_ylabel()

        for line_index, line in enumerate(ax.get_lines()):
            label = line.get_label()
            if not label or label.startswith("_"):
                label = f"series {line_index + 1}"
            series.append(_xy_series(line.get_xdata(), line.get_ydata(), label))
            chart_type = "line"

        for collection_index, collection in enumerate(ax.collections):
            try:
                offsets = collection.get_offsets()
                if len(offsets):
                    xs = [point[0] for point in offsets]
                    ys = [point[1] for point in offsets]
                    series.append(_xy_series(xs, ys, f"scatter {collection_index + 1}"))
                    chart_type = "scatter"
            except Exception:
                pass

        rectangles = []
        for patch in ax.patches:
            try:
                width = patch.get_width()
                height = patch.get_height()
                if width != 0 and height is not None:
                    rectangles.append((patch.get_x() + width / 2, height))
            except Exception:
                pass
        if rectangles and not series:
            xs = [item[0] for item in rectangles]
            ys = [item[1] for item in rectangles]
            series.append(_xy_series(xs, ys, "values"))
            chart_type = "bar"

    if not series:
        return None

    return {
        "kind": "chart",
        "chartType": chart_type,
        "title": chart_title,
        "xLabel": x_label,
        "yLabel": y_label,
        "series": series
    }

def _normalize(value, title="result"):
    try:
        import numpy as np
        import pandas as pd
        import matplotlib.figure
    except Exception:
        np = None
        pd = None

    try:
        if pd is not None and isinstance(value, pd.DataFrame):
            return _table_from_dataframe(value, title)
        if pd is not None and isinstance(value, pd.Series):
            return _table_from_series(value, title)
        if np is not None and isinstance(value, np.ndarray):
            return _array_from_array(value, title)
        if np is not None and isinstance(value, (list, tuple)) and value and all(isinstance(item, (int, float, np.number)) for item in value):
            return _array_from_array(value, title)
        if "matplotlib.figure" in sys.modules and isinstance(value, sys.modules["matplotlib.figure"].Figure):
            figure_payload = _chart_from_figure(value, title)
            if figure_payload:
                return figure_payload
        if value is None:
            return None
        return {"kind": "text", "title": title, "text": str(value)}
    except Exception as exc:
        return {"kind": "text", "title": title, "text": f"Could not render object: {exc}"}

def _add_capture(value, title="result"):
    payload = _normalize(value, title)
    if payload is not None:
        _captures.append(payload)
    return value

def _safe_unparse(node):
    try:
        return ast.unparse(node)
    except Exception:
        return None

def _assignment_titles(tree):
    titles = []
    for node in tree.body:
        if isinstance(node, ast.Assign):
            value_title = _safe_unparse(node.value)
            for target in node.targets:
                if isinstance(target, ast.Name):
                    titles.append((target.id, f"{target.id} = {value_title}" if value_title else target.id))
        elif isinstance(node, ast.AnnAssign) and isinstance(node.target, ast.Name):
            value_title = _safe_unparse(node.value) if node.value is not None else None
            titles.append((node.target.id, f"{node.target.id} = {value_title}" if value_title else node.target.id))
    return titles

def _install_display_hooks():
    try:
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt

        names = ["plot", "bar", "scatter", "hist", "show"]
        for name in names:
            current = getattr(plt, name)
            original = getattr(current, "_pyvisuals_original", current)

            def make_wrapper(function_name, original_function):
                def wrapped(*args, **kwargs):
                    result = original_function(*args, **kwargs)
                    label = kwargs.get("label") or function_name
                    if function_name == "plot":
                        if len(args) == 1:
                            y_values = args[0]
                            x_values = range(len(_sequence(y_values)))
                        else:
                            x_values, y_values = args[0], args[1]
                        _captures.append({
                            "kind": "chart",
                            "chartType": "line",
                            "title": "plt.plot()",
                            "series": [_xy_series(x_values, y_values, label)]
                        })
                    elif function_name == "bar" and len(args) >= 2:
                        _captures.append({
                            "kind": "chart",
                            "chartType": "bar",
                            "title": "plt.bar()",
                            "series": [_xy_series(args[0], args[1], label)]
                        })
                    elif function_name == "scatter" and len(args) >= 2:
                        _captures.append({
                            "kind": "chart",
                            "chartType": "scatter",
                            "title": "plt.scatter()",
                            "series": [_xy_series(args[0], args[1], label)]
                        })
                    elif function_name == "hist" and len(args) >= 1:
                        import numpy as np
                        counts, bins = np.histogram(args[0], bins=kwargs.get("bins", 10))
                        centers = [(bins[index] + bins[index + 1]) / 2 for index in range(len(counts))]
                        _captures.append({
                            "kind": "chart",
                            "chartType": "hist",
                            "title": "plt.hist()",
                            "series": [_xy_series(centers, counts, label)]
                        })
                    elif function_name == "show":
                        payload = _chart_from_current_figure()
                        if payload:
                            _captures.append(payload)
                    return result
                wrapped._pyvisuals_original = original_function
                return wrapped

            setattr(plt, name, make_wrapper(name, original))
    except Exception:
        pass

    try:
        import pandas as pd
        method_pairs = [
            (pd.DataFrame, "head"),
            (pd.DataFrame, "describe"),
            (pd.Series, "head"),
            (pd.Series, "describe")
        ]
        for cls, method_name in method_pairs:
            current = getattr(cls, method_name)
            original = getattr(current, "_pyvisuals_original", current)

            def make_method_wrapper(name, original_method):
                def wrapped(self, *args, **kwargs):
                    result = original_method(self, *args, **kwargs)
                    _add_capture(result, f"{type(self).__name__}.{name}()")
                    return result
                wrapped._pyvisuals_original = original_method
                return wrapped

            setattr(cls, method_name, make_method_wrapper(method_name, original))
    except Exception:
        pass

class _CaptureStream:
    def __init__(self, stream):
        self.stream = stream

    def write(self, text):
        if text:
            _terminal.append({"stream": self.stream, "text": text})

    def flush(self):
        pass

def _execute_user_code():
    _install_display_hooks()
    user_globals = {
        "__name__": "__main__",
        "display": lambda value: _add_capture(value, "display()")
    }

    tree = ast.parse(_code, filename="<pyvisuals>", mode="exec")
    assigned_titles = _assignment_titles(tree)
    final_expression = None
    final_expression_title = None
    if tree.body and isinstance(tree.body[-1], ast.Expr):
        expression_node = tree.body.pop().value
        final_expression = ast.Expression(expression_node)
        final_expression_title = _safe_unparse(expression_node)
        ast.fix_missing_locations(tree)
        ast.fix_missing_locations(final_expression)

    if tree.body:
        exec(compile(tree, "<pyvisuals>", "exec"), user_globals, user_globals)

    if final_expression is not None:
        value = eval(compile(final_expression, "<pyvisuals>", "eval"), user_globals, user_globals)
        _add_capture(value, final_expression_title or "last expression")
    
    if not _captures and assigned_titles:
        for name, title in assigned_titles:
            if name in user_globals:
                _add_capture(user_globals[name], title)

def _run():
    ok = True
    error = None
    original_stdout = sys.stdout
    original_stderr = sys.stderr

    try:
        sys.stdout = _CaptureStream("stdout")
        sys.stderr = _CaptureStream("stderr")
        _execute_user_code()
    except Exception:
        ok = False
        error = traceback.format_exc()
        traceback.print_exc()
    finally:
        sys.stdout = original_stdout
        sys.stderr = original_stderr

    if not _captures and ok and _mode == "live":
        _captures.append({"kind": "empty", "title": "No visual output", "text": "The code ran, but did not produce a displayable value."})

    if error and _mode == "live":
        _captures[:] = [{"kind": "text", "title": "Python exception", "text": error}]

    return json.dumps({
        "ok": ok,
        "visuals": _captures,
        "terminal": _terminal,
        "error": error
    }, allow_nan=False)

_run()
`;
