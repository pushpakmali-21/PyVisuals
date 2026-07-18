/* ─────────────────────────────────────────────────────────
   NumPy Module — Lesson Definitions
   To add a new library: create lib/modules/<name>/index.ts
   with the same shape and import it in the module hub.
───────────────────────────────────────────────────────── */

export type ContentBlock =
  | { type: "prose"; html: string }
  | { type: "code"; label: string; code: string }
  | { type: "sandbox"; label: string; code: string; hint?: string }
  | { type: "exercise"; question: string; starterCode: string; hint?: string }
  | { type: "quiz"; question: string; options: string[]; correct: number; explanation: string }
  | { type: "tip"; text: string }
  | { type: "warning"; text: string };

export type Lesson = {
  id: string;
  title: string;
  duration: string; // "5 min"
  blocks: ContentBlock[];
};

export type LessonGroup = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export const NUMPY_MODULE: LessonGroup[] = [
  /* ── 1. Introduction ───────────────────────────────── */
  {
    id: "intro",
    title: "Introduction",
    lessons: [
      {
        id: "what-is-numpy",
        title: "What is NumPy?",
        duration: "5 min",
        blocks: [
          {
            type: "prose",
            html: `
<h2>What is NumPy?</h2>
<p><strong>NumPy</strong> (Numerical Python) is the foundational library for numerical computing in Python. 
Almost every data science, machine learning, or scientific computing library — pandas, TensorFlow, PyTorch, SciPy — 
is built on top of NumPy.</p>

<h3>Why NumPy over plain Python lists?</h3>
<ul>
  <li><strong>Speed</strong>: NumPy operations execute in compiled C code, making them 10–100× faster than Python loops.</li>
  <li><strong>Memory efficiency</strong>: A NumPy array of 1 million floats uses ~8 MB; an equivalent Python list uses ~56 MB.</li>
  <li><strong>Vectorised operations</strong>: Apply math to entire arrays in one line — no <code>for</code> loops needed.</li>
  <li><strong>Broadcasting</strong>: Operate on arrays of different shapes without manually reshaping them.</li>
  <li><strong>Ecosystem</strong>: Seamlessly integrates with pandas, matplotlib, scikit-learn, and more.</li>
</ul>

<h3>The ndarray</h3>
<p>The core object in NumPy is the <code>ndarray</code> (N-dimensional array) — a homogeneous, 
fixed-size grid of values with a known <strong>shape</strong> and <strong>dtype</strong>.</p>
`
          },
          {
            type: "tip",
            text: "NumPy is almost always imported as `import numpy as np`. This is a universal convention — use it."
          },
          {
            type: "sandbox",
            label: "Your first NumPy array",
            code: `import numpy as np

# Create a 1D array
a = np.array([10, 20, 30, 40, 50])

print("Array:", a)
print("Shape:", a.shape)
print("Dtype:", a.dtype)
print("Size:", a.size)
print("ndim:", a.ndim)

a`,
            hint: "Run this to see the array shape and dtype. Try changing the values!"
          },
          {
            type: "quiz",
            question: "What does `ndarray` stand for in NumPy?",
            options: [
              "Numerical Data Array",
              "N-Dimensional Array",
              "New Dynamic Array",
              "Nested Data Array"
            ],
            correct: 1,
            explanation: "`ndarray` stands for N-Dimensional Array — the core data structure in NumPy that can represent scalars, vectors, matrices, and higher-dimensional tensors."
          }
        ]
      },
      {
        id: "installation",
        title: "Installation & Import",
        duration: "3 min",
        blocks: [
          {
            type: "prose",
            html: `
<h2>Installation & Import</h2>
<p>NumPy is already available in this browser environment — no installation needed here. 
But for your own projects:</p>

<h3>Install with pip</h3>
<pre style="background:#1c2330;color:#4fd1c5;padding:12px;border-radius:6px;font-family:monospace">pip install numpy</pre>

<h3>Install with conda</h3>
<pre style="background:#1c2330;color:#4fd1c5;padding:12px;border-radius:6px;font-family:monospace">conda install numpy</pre>

<h3>Standard import convention</h3>
<p>Always import NumPy with the alias <code>np</code>:</p>
`
          },
          {
            type: "code",
            label: "Standard import",
            code: `import numpy as np

# Check your version
print(np.__version__)`
          },
          {
            type: "sandbox",
            label: "Try it — check NumPy version",
            code: `import numpy as np
print("NumPy version:", np.__version__)
print("Available functions (first 20):", dir(np)[:20])`,
            hint: "Run this to confirm NumPy is loaded and working."
          }
        ]
      }
    ]
  },

  /* ── 2. Array Basics ───────────────────────────────── */
  {
    id: "arrays",
    title: "Array Basics",
    lessons: [
      {
        id: "creating-arrays",
        title: "Creating Arrays",
        duration: "8 min",
        blocks: [
          {
            type: "prose",
            html: `
<h2>Creating Arrays</h2>
<p>NumPy provides many ways to create arrays depending on your need.</p>

<h3>From Python sequences</h3>
<p>Use <code>np.array()</code> to convert lists or tuples into NumPy arrays:</p>
`
          },
          {
            type: "sandbox",
            label: "From lists",
            code: `import numpy as np

# 1D array (vector)
v = np.array([1, 2, 3, 4, 5])

# 2D array (matrix)
m = np.array([[1, 2, 3],
              [4, 5, 6]])

print("1D shape:", v.shape)
print("2D shape:", m.shape)

# Inspect the matrix
m`,
            hint: "The visualizer will render the matrix as a colour-coded grid!"
          },
          {
            type: "prose",
            html: `
<h3>Convenience constructors</h3>
<p>NumPy has built-in functions to create common arrays without typing all values manually:</p>
<ul>
  <li><code>np.zeros(shape)</code> — array of all zeros</li>
  <li><code>np.ones(shape)</code> — array of all ones</li>
  <li><code>np.full(shape, value)</code> — array filled with a constant</li>
  <li><code>np.eye(n)</code> — identity matrix</li>
  <li><code>np.arange(start, stop, step)</code> — like Python <code>range()</code></li>
  <li><code>np.linspace(start, stop, num)</code> — evenly spaced over an interval</li>
  <li><code>np.random.rand(shape)</code> — uniform random values in [0, 1)</li>
</ul>
`
          },
          {
            type: "sandbox",
            label: "Convenience constructors",
            code: `import numpy as np

zeros  = np.zeros((3, 4))
ones   = np.ones((2, 5))
eye    = np.eye(4)
rng    = np.arange(0, 10, 2)
linsp  = np.linspace(0, 1, 6)
rand   = np.random.rand(3, 3)

print("zeros:", zeros)
print("\\nones:", ones)
print("\\neye:", eye)
print("\\narange:", rng)
print("\\nlinspace:", linsp)
print("\\nrandom:", rand)

# Display the identity matrix visually
eye`,
            hint: "Change the shapes and values. Try np.full((3,3), 7)."
          },
          {
            type: "exercise",
            question: "Create a 4×4 matrix filled with the value 42, and a 1D array of even numbers from 0 to 20 (inclusive).",
            starterCode: `import numpy as np

# Your code here
matrix = ...
evens  = ...

print(matrix)
print(evens)`,
            hint: "Use np.full() for the matrix, and np.arange() with step=2 for the evens."
          },
          {
            type: "quiz",
            question: "Which function creates an array of 50 evenly-spaced values between 0 and 1?",
            options: [
              "np.arange(0, 1, 50)",
              "np.linspace(0, 1, 50)",
              "np.range(0, 1, 50)",
              "np.space(0, 1, n=50)"
            ],
            correct: 1,
            explanation: "`np.linspace(start, stop, num)` creates `num` evenly-spaced values from `start` to `stop` (inclusive). `np.arange` uses a step size, not a count."
          }
        ]
      },
      {
        id: "dtypes",
        title: "Data Types (dtypes)",
        duration: "5 min",
        blocks: [
          {
            type: "prose",
            html: `
<h2>Data Types (dtypes)</h2>
<p>Every NumPy array has a single <strong>dtype</strong> — the type of all its elements. 
Unlike Python lists, all values in an ndarray must be the same type, which is what enables 
the speed advantage.</p>

<h3>Common dtypes</h3>
<ul>
  <li><code>float64</code> — 64-bit floating point (default for decimal numbers)</li>
  <li><code>int64</code> — 64-bit integer (default for whole numbers)</li>
  <li><code>bool</code> — True / False</li>
  <li><code>complex128</code> — complex numbers</li>
  <li><code>str_</code> — fixed-length strings</li>
  <li><code>object</code> — Python objects (avoid — loses speed advantage)</li>
</ul>
`
          },
          {
            type: "sandbox",
            label: "Exploring dtypes",
            code: `import numpy as np

a = np.array([1, 2, 3])           # int64
b = np.array([1.0, 2.0, 3.0])     # float64
c = np.array([True, False, True])  # bool
d = np.array([1, 2, 3], dtype=np.float32)  # explicit dtype

print("int array:", a, "dtype:", a.dtype)
print("float array:", b, "dtype:", b.dtype)
print("bool array:", c, "dtype:", c.dtype)
print("float32:", d, "dtype:", d.dtype)

# Cast to another type
e = a.astype(np.float64)
print("casted:", e, "dtype:", e.dtype)`,
            hint: "NumPy auto-infers dtype. Use astype() to convert between types."
          },
          {
            type: "tip",
            text: "Mixing integers and floats in `np.array([1, 2, 3.0])` will automatically upcast the entire array to float64."
          }
        ]
      }
    ]
  },

  /* ── 3. Indexing & Slicing ─────────────────────────── */
  {
    id: "indexing",
    title: "Indexing & Slicing",
    lessons: [
      {
        id: "basic-indexing",
        title: "Basic Indexing",
        duration: "7 min",
        blocks: [
          {
            type: "prose",
            html: `
<h2>Basic Indexing</h2>
<p>NumPy indexing follows Python list syntax but extends it to multiple dimensions.</p>

<h3>1D indexing</h3>
<p>Same as Python lists: <code>a[0]</code>, <code>a[-1]</code>, <code>a[2:5]</code></p>

<h3>2D indexing</h3>
<p>Use comma-separated indices: <code>m[row, col]</code> instead of <code>m[row][col]</code></p>

<h3>Slicing</h3>
<p><code>a[start:stop:step]</code> — same syntax as Python, works on each axis independently.</p>
`
          },
          {
            type: "sandbox",
            label: "Indexing a 2D array",
            code: `import numpy as np

m = np.array([[10, 20, 30],
              [40, 50, 60],
              [70, 80, 90]])

print("Full matrix:")
print(m)

print("\\nElement at row 1, col 2:", m[1, 2])   # 60
print("First row:", m[0])
print("Last column:", m[:, -1])                  # [30, 60, 90]
print("Top-left 2x2 submatrix:")
print(m[:2, :2])
print("Every other row:", m[::2])`,
            hint: "m[:, 1] means 'all rows, column 1'. Try extracting the middle row and middle column."
          },
          {
            type: "exercise",
            question: "Given the matrix below, extract: (a) the second row, (b) the third column, (c) the bottom-right 2×2 submatrix.",
            starterCode: `import numpy as np

m = np.array([[ 1,  2,  3,  4],
              [ 5,  6,  7,  8],
              [ 9, 10, 11, 12],
              [13, 14, 15, 16]])

second_row = ...
third_col  = ...
br_2x2     = ...

print("Second row:", second_row)
print("Third column:", third_col)
print("Bottom-right 2x2:\\n", br_2x2)`,
            hint: "Rows are indexed 0–3. Columns are indexed 0–3. Bottom-right 2×2 is rows [2:, 2:]."
          }
        ]
      },
      {
        id: "boolean-indexing",
        title: "Boolean & Fancy Indexing",
        duration: "6 min",
        blocks: [
          {
            type: "prose",
            html: `
<h2>Boolean & Fancy Indexing</h2>
<p>NumPy lets you index arrays using boolean masks or arbitrary index arrays — 
two incredibly powerful techniques for data filtering.</p>

<h3>Boolean indexing (masking)</h3>
<p>A comparison like <code>a > 5</code> returns a boolean array of the same shape. 
Passing it back into <code>a[...]</code> selects only the <code>True</code> elements.</p>

<h3>Fancy indexing</h3>
<p>Pass a list of integer indices to select specific elements in any order: <code>a[[0, 2, 4]]</code></p>
`
          },
          {
            type: "sandbox",
            label: "Boolean masking",
            code: `import numpy as np

scores = np.array([72, 85, 91, 63, 88, 55, 79, 94])

# Boolean mask: which scores pass?
mask = scores >= 80
print("Passing mask:", mask)
print("Passing scores:", scores[mask])

# Shorthand (same thing)
print("Shorthand:", scores[scores >= 80])

# Combined conditions
print("Between 70-90:", scores[(scores >= 70) & (scores <= 90)])

# Replace values using mask
scores[scores < 70] = 70   # floor at 70
print("After flooring:", scores)`,
            hint: "Boolean indexing is the NumPy way to filter data without loops!"
          },
          {
            type: "sandbox",
            label: "Fancy indexing",
            code: `import numpy as np

colours = np.array(["red", "green", "blue", "yellow", "purple"])

# Select by index list
print(colours[[0, 2, 4]])   # red, blue, purple

# Reverse using fancy index
print(colours[[4, 3, 2, 1, 0]])

# Use np.where to get indices of condition
scores = np.array([72, 85, 91, 63, 88])
idx = np.where(scores > 80)
print("Indices of scores > 80:", idx[0])
print("Values:", scores[idx])`,
            hint: "np.where() returns a tuple of arrays; use [0] to get the first dimension."
          }
        ]
      }
    ]
  },

  /* ── 4. Operations ─────────────────────────────────── */
  {
    id: "operations",
    title: "Array Operations",
    lessons: [
      {
        id: "math-operations",
        title: "Maths & Arithmetic",
        duration: "7 min",
        blocks: [
          {
            type: "prose",
            html: `
<h2>Maths & Arithmetic</h2>
<p>NumPy operations are <strong>vectorised</strong> — they apply element-wise to the entire array 
without writing a loop. This is both cleaner and significantly faster.</p>

<h3>Element-wise arithmetic</h3>
<p>Standard operators (<code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>, <code>**</code>) 
all work element-wise between arrays of the same shape.</p>
`
          },
          {
            type: "sandbox",
            label: "Element-wise operations",
            code: `import numpy as np

a = np.array([1, 2, 3, 4, 5])
b = np.array([10, 20, 30, 40, 50])

print("a + b  =", a + b)
print("b - a  =", b - a)
print("a * b  =", a * b)
print("b / a  =", b / a)
print("a ** 2 =", a ** 2)

# Scalar operations broadcast automatically
print("a * 3  =", a * 3)
print("b + 5  =", b + 5)

# Universal functions (ufuncs)
print("sqrt(a)=", np.sqrt(a))
print("sin(a) =", np.sin(a).round(4))
print("log(b) =", np.log(b).round(4))`,
            hint: "All these operations execute in C — no Python loop involved!"
          },
          {
            type: "prose",
            html: `
<h3>Aggregate functions</h3>
<p>Reduce an entire array (or along an axis) to a single value:</p>
<ul>
  <li><code>np.sum(a)</code> / <code>a.sum()</code></li>
  <li><code>np.mean(a)</code> / <code>a.mean()</code></li>
  <li><code>np.std(a)</code> / <code>a.std()</code></li>
  <li><code>np.min(a)</code>, <code>np.max(a)</code></li>
  <li><code>np.argmin(a)</code>, <code>np.argmax(a)</code> — index of min/max</li>
  <li><code>np.cumsum(a)</code> — running total</li>
</ul>
`
          },
          {
            type: "sandbox",
            label: "Aggregations on a 2D array",
            code: `import numpy as np

m = np.array([[3, 7, 2],
              [9, 1, 5],
              [4, 8, 6]])

print("Sum (all):      ", m.sum())
print("Mean (all):     ", m.mean())
print("Max (all):      ", m.max())
print("Argmax index:   ", m.argmax())   # flattened index

# Axis 0 = along rows (per column)
print("Sum col-wise:   ", m.sum(axis=0))
print("Mean col-wise:  ", m.mean(axis=0))

# Axis 1 = along columns (per row)
print("Sum row-wise:   ", m.sum(axis=1))
print("Max per row:    ", m.max(axis=1))`,
            hint: "axis=0 collapses rows (result has one value per column). axis=1 collapses columns."
          }
        ]
      },
      {
        id: "broadcasting",
        title: "Broadcasting",
        duration: "8 min",
        blocks: [
          {
            type: "prose",
            html: `
<h2>Broadcasting</h2>
<p>Broadcasting is NumPy's way of applying operations between arrays of <em>different but compatible shapes</em> 
without copying data. It follows a strict set of rules:</p>

<h3>Rules</h3>
<ol style="padding-left:1.5rem;color:#94a3b8;line-height:1.8">
  <li>If the arrays have different numbers of dimensions, the shape of the smaller array is <strong>padded with 1s on the left</strong>.</li>
  <li>Arrays with size 1 along any dimension are <strong>stretched</strong> to match the other array.</li>
  <li>Sizes must match or one must be 1 — otherwise a shape error is raised.</li>
</ol>

<blockquote>Think of it as: "NumPy virtually repeats the smaller array to make shapes match, without actually copying memory."</blockquote>
`
          },
          {
            type: "sandbox",
            label: "Broadcasting examples",
            code: `import numpy as np

# Scalar broadcast — most common case
a = np.array([1, 2, 3, 4])
print("a * 10:", a * 10)

# 1D broadcast over 2D rows
m = np.array([[1, 2, 3],
              [4, 5, 6],
              [7, 8, 9]])

row = np.array([10, 20, 30])   # shape (3,)
print("\\nm + row (adds row to each row):")
print(m + row)

# Column broadcast (shape (3,1) broadcasts over columns)
col = np.array([[100],
                [200],
                [300]])   # shape (3,1)
print("\\nm + col (adds column to each column):")
print(m + col)

# Outer product via broadcasting
x = np.array([1, 2, 3])[:, np.newaxis]  # (3,1)
y = np.array([1, 2, 3, 4])              # (4,)
print("\\nOuter product shape:", (x * y).shape)
x * y`,
            hint: "np.newaxis inserts a new axis. It's equivalent to reshape(-1, 1)."
          },
          {
            type: "tip",
            text: "Use `a.reshape(-1, 1)` or `a[:, np.newaxis]` to turn a 1D row vector into a column vector for broadcasting along columns."
          },
          {
            type: "exercise",
            question: "Normalise each column of the matrix `m` so that each column has a mean of 0 (subtract column mean from each element). Do it in one vectorised line.",
            starterCode: `import numpy as np

m = np.array([[10., 20., 30.],
              [14., 25., 28.],
              [12., 18., 35.]])

# Subtract column means using broadcasting
normalised = ...

print(normalised)
print("Column means (should be ~0):", normalised.mean(axis=0))`,
            hint: "m.mean(axis=0) has shape (3,). It broadcasts over m's rows automatically."
          }
        ]
      }
    ]
  },

  /* ── 5. Reshaping & Stacking ───────────────────────── */
  {
    id: "reshaping",
    title: "Reshaping & Stacking",
    lessons: [
      {
        id: "reshape",
        title: "Reshape, Flatten & Transpose",
        duration: "6 min",
        blocks: [
          {
            type: "prose",
            html: `
<h2>Reshape, Flatten & Transpose</h2>
<p>NumPy lets you change an array's shape without copying its data (when possible).</p>

<h3>Key functions</h3>
<ul>
  <li><code>a.reshape(new_shape)</code> — new view with different shape</li>
  <li><code>a.flatten()</code> — 1D copy (always a copy)</li>
  <li><code>a.ravel()</code> — 1D view (no copy if possible)</li>
  <li><code>a.T</code> — transpose (swap axes)</li>
  <li><code>np.transpose(a, axes)</code> — reorder arbitrary axes</li>
</ul>

<p>Use <code>-1</code> as a wildcard dimension in reshape — NumPy infers it automatically.</p>
`
          },
          {
            type: "sandbox",
            label: "Reshape and transpose",
            code: `import numpy as np

a = np.arange(12)   # [0..11]
print("Original:", a)

# Reshape to 3x4 matrix
m = a.reshape(3, 4)
print("\\n3x4 matrix:")
print(m)

# -1 lets NumPy infer the dimension
m2 = a.reshape(-1, 3)  # 4x3
print("\\n4x3 (auto):")
print(m2)

# Flatten
print("\\nFlatten:", m.flatten())

# Transpose
print("\\nTranspose shape:", m.T.shape)
print(m.T)

m`,
            hint: "Reshape doesn't copy data — it's just a different view. Modifying the view modifies the original!"
          },
          {
            type: "sandbox",
            label: "Stacking arrays",
            code: `import numpy as np

a = np.array([[1, 2], [3, 4]])
b = np.array([[5, 6], [7, 8]])

# Stack vertically (add rows)
v = np.vstack([a, b])
print("vstack (vertical):")
print(v)

# Stack horizontally (add columns)
h = np.hstack([a, b])
print("\\nhstack (horizontal):")
print(h)

# Concatenate along axis
c = np.concatenate([a, b], axis=0)  # same as vstack
print("\\nconcatenate axis=0:")
print(c)

v`
          }
        ]
      }
    ]
  },

  /* ── 6. Common Functions ───────────────────────────── */
  {
    id: "functions",
    title: "Common Functions",
    lessons: [
      {
        id: "math-functions",
        title: "Mathematical Functions",
        duration: "6 min",
        blocks: [
          {
            type: "prose",
            html: `
<h2>Mathematical Functions</h2>
<p>NumPy provides <strong>universal functions (ufuncs)</strong> — vectorised implementations of 
standard mathematical operations. They are applied element-wise and are much faster than Python's 
built-in <code>math</code> module for arrays.</p>

<h3>Common ufuncs</h3>
<ul>
  <li><code>np.abs(a)</code> — absolute value</li>
  <li><code>np.sqrt(a)</code>, <code>np.square(a)</code>, <code>np.power(a, n)</code></li>
  <li><code>np.exp(a)</code>, <code>np.log(a)</code>, <code>np.log2(a)</code>, <code>np.log10(a)</code></li>
  <li><code>np.sin(a)</code>, <code>np.cos(a)</code>, <code>np.tan(a)</code></li>
  <li><code>np.floor(a)</code>, <code>np.ceil(a)</code>, <code>np.round(a, decimals)</code></li>
  <li><code>np.clip(a, min, max)</code> — clamp values to a range</li>
  <li><code>np.sort(a)</code>, <code>np.argsort(a)</code></li>
  <li><code>np.unique(a)</code>, <code>np.bincount(a)</code></li>
  <li><code>np.dot(a, b)</code>, <code>a @ b</code> — matrix/dot product</li>
</ul>
`
          },
          {
            type: "sandbox",
            label: "Common ufuncs in action",
            code: `import numpy as np

x = np.linspace(-2, 2, 9)
print("x:", x.round(2))
print("abs:", np.abs(x).round(2))
print("square:", np.square(x).round(2))
print("clip[-1,1]:", np.clip(x, -1, 1).round(2))
print("floor:", np.floor(x))
print("ceil:", np.ceil(x))

# Sorting
arr = np.array([5, 2, 8, 1, 9, 3])
print("\\nOriginal:", arr)
print("Sorted:  ", np.sort(arr))
print("Argsort: ", np.argsort(arr))  # indices that would sort

# Matrix multiplication
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
print("\\nA @ B:")
print(A @ B)`,
            hint: "np.argsort returns the indices that would sort the array — useful for ranking!"
          },
          {
            type: "exercise",
            question: "Given an array of exam scores, compute: (a) the z-scores (subtract mean, divide by std), (b) the ranks of each student (1 = highest).",
            starterCode: `import numpy as np

scores = np.array([78, 92, 65, 88, 71, 95, 83, 60])

# Z-scores
z_scores = ...

# Ranks (1 = highest score)
# Hint: argsort of argsort gives ranks; reverse for descending
ranks = ...

print("Scores:", scores)
print("Z-scores:", z_scores.round(2))
print("Ranks:", ranks)`,
            hint: "z = (x - x.mean()) / x.std(). For ranks: argsort(-scores) + 1 gives descending rank."
          }
        ]
      },
      {
        id: "linear-algebra",
        title: "Linear Algebra",
        duration: "7 min",
        blocks: [
          {
            type: "prose",
            html: `
<h2>Linear Algebra</h2>
<p>NumPy's <code>numpy.linalg</code> submodule provides essential linear algebra operations 
used across machine learning, data science, and scientific computing.</p>

<h3>Key functions</h3>
<ul>
  <li><code>np.dot(a, b)</code> or <code>a @ b</code> — dot / matrix product</li>
  <li><code>np.linalg.det(m)</code> — determinant</li>
  <li><code>np.linalg.inv(m)</code> — matrix inverse</li>
  <li><code>np.linalg.norm(v)</code> — vector or matrix norm</li>
  <li><code>np.linalg.eig(m)</code> — eigenvalues and eigenvectors</li>
  <li><code>np.linalg.solve(A, b)</code> — solve linear system Ax=b</li>
  <li><code>np.linalg.svd(m)</code> — Singular Value Decomposition</li>
</ul>
`
          },
          {
            type: "sandbox",
            label: "Linear algebra examples",
            code: `import numpy as np

A = np.array([[2., 1.],
              [5., 3.]])

b = np.array([4., 7.])

# Solve 2x1 + 1x2 = 4, 5x1 + 3x2 = 7
x = np.linalg.solve(A, b)
print("Solution x:", x)
print("Verify Ax:", A @ x)  # should equal b

# Determinant and inverse
print("\\nDet(A):", np.linalg.det(A))
print("A_inv:")
print(np.linalg.inv(A))

# Norm of a vector
v = np.array([3., 4.])
print("\\n||v||:", np.linalg.norm(v))   # 5.0 (Pythagorean)

# Eigenvalues
vals, vecs = np.linalg.eig(A)
print("\\nEigenvalues:", vals.round(4))`,
            hint: "np.linalg.solve is much more numerically stable than computing A_inv @ b directly."
          }
        ]
      }
    ]
  },

  /* ── 7. Real-world Use Cases ───────────────────────── */
  {
    id: "usecases",
    title: "Real-World Use Cases",
    lessons: [
      {
        id: "data-analysis",
        title: "Data Analysis with NumPy",
        duration: "8 min",
        blocks: [
          {
            type: "prose",
            html: `
<h2>Data Analysis with NumPy</h2>
<p>NumPy is the building block of all data analysis in Python. Even pandas DataFrames 
are backed by NumPy arrays internally. Here are common real-world patterns.</p>
`
          },
          {
            type: "sandbox",
            label: "Statistical analysis",
            code: `import numpy as np

# Simulated sales data: 12 months × 5 products
rng = np.random.default_rng(42)
sales = rng.integers(80, 200, size=(12, 5)).astype(float)

print("Sales matrix (12 months × 5 products):")
print(sales[:3], "...(3 of 12 rows shown)")

# Monthly totals
monthly_total = sales.sum(axis=1)
print("\\nMonthly totals:", monthly_total.astype(int))

# Best product per month
best_product = sales.argmax(axis=1) + 1   # 1-indexed
print("Best product each month:", best_product)

# Products with average > 140
product_avg = sales.mean(axis=0)
print("\\nProduct averages:", product_avg.round(1))
print("Above 140:", np.where(product_avg > 140)[0] + 1)

# Percentage contribution each month
share = sales / sales.sum(axis=1, keepdims=True) * 100
print("\\nMonth 1 shares (%):", share[0].round(1))`,
            hint: "keepdims=True preserves the shape (12,1) so broadcasting works correctly."
          },
          {
            type: "sandbox",
            label: "Image-as-array (grayscale manipulation)",
            code: `import numpy as np

# Simulate a 6x8 grayscale image (pixel values 0-255)
rng = np.random.default_rng(0)
img = rng.integers(0, 256, size=(6, 8), dtype=np.uint8)
print("Original image (pixel values):")
print(img)

# Invert (negative)
inverted = 255 - img
print("\\nInverted:")
print(inverted)

# Threshold (binary)
binary = (img > 128).astype(np.uint8) * 255
print("\\nThresholded at 128:")
print(binary)

# Crop: top-left 3x4 region
crop = img[:3, :4]
print("\\nCrop (3x4):")
print(crop)

img`,
            hint: "Images are just 2D (grayscale) or 3D (RGB: H×W×3) NumPy arrays. All image processing libraries use this."
          }
        ]
      }
    ]
  },

  /* ── 8. Practice Exercises ─────────────────────────── */
  {
    id: "practice",
    title: "Practice Exercises",
    lessons: [
      {
        id: "exercises",
        title: "Practice Problems",
        duration: "20 min",
        blocks: [
          {
            type: "prose",
            html: `
<h2>Practice Problems</h2>
<p>Complete the following exercises to test your NumPy skills. 
Each builds on what you've learned in the previous sections.</p>
`
          },
          {
            type: "exercise",
            question: "**Exercise 1 — Array creation**: Create a 5×5 matrix where the border elements are 1 and all interior elements are 0. Do it without loops.",
            starterCode: `import numpy as np

# Hint: start with ones, then set interior slice to 0
border = ...

print(border)`,
            hint: "Start with np.ones((5,5)), then use m[1:-1, 1:-1] = 0 to zero out the interior."
          },
          {
            type: "exercise",
            question: "**Exercise 2 — Boolean masking**: Given an array of temperatures in Celsius, return all temperatures above freezing (>0) converted to Fahrenheit.",
            starterCode: `import numpy as np

temps_c = np.array([-5, 0, 3, -2, 7, 12, -8, 1])

# Filter and convert: F = C * 9/5 + 32
temps_f_above_zero = ...

print("Fahrenheit (above freezing):", temps_f_above_zero)`,
            hint: "Use boolean indexing: temps_c[temps_c > 0] to filter, then apply the formula."
          },
          {
            type: "exercise",
            question: "**Exercise 3 — Linear algebra**: Compute the cosine similarity between two vectors a and b. Formula: cos(θ) = (a·b) / (||a|| × ||b||)",
            starterCode: `import numpy as np

a = np.array([1., 2., 3.])
b = np.array([4., 5., 6.])

# Cosine similarity
similarity = ...

print(f"Cosine similarity: {similarity:.4f}")`,
            hint: "Use np.dot(a, b) for dot product, np.linalg.norm() for magnitude."
          },
          {
            type: "exercise",
            question: "**Exercise 4 — Broadcasting**: Without loops, create a 10×10 multiplication table (where entry [i,j] = (i+1)*(j+1)).",
            starterCode: `import numpy as np

# rows and cols: shapes (10,1) and (1,10) — what happens when you multiply?
rows = np.arange(1, 11).reshape(10, 1)
cols = np.arange(1, 11).reshape(1, 10)

table = ...

print(table)`,
            hint: "When you multiply (10,1) by (1,10), broadcasting creates a (10,10) outer product."
          }
        ]
      }
    ]
  }
];

/** Flatten all lessons for O(1) lookup by id */
export function getLessonById(id: string): Lesson | undefined {
  for (const group of NUMPY_MODULE) {
    for (const lesson of group.lessons) {
      if (lesson.id === id) return lesson;
    }
  }
  return undefined;
}

/** Get the first lesson in the module */
export function getFirstLesson(): Lesson {
  return NUMPY_MODULE[0].lessons[0];
}

/** Get prev/next lesson across groups */
export function getAdjacentLessons(id: string): { prev: Lesson | null; next: Lesson | null } {
  const all: Lesson[] = NUMPY_MODULE.flatMap((g) => g.lessons);
  const idx = all.findIndex((l) => l.id === id);
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null
  };
}
