/* ─────────────────────────────────────────────────────────
   ML Launchpad Module — Lesson Definitions
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
  duration: string;
  blocks: ContentBlock[];
};

export type LessonGroup = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export const ML_LAUNCHPAD_MODULE: LessonGroup[] = [
  /* ── Day 1 ───────────────────────────────────────── */
  {
    id: "day-1",
    title: "Day 1 – Python Fundamentals",
    lessons: [
      {
        id: "d1-intro",
        title: "Introduction",
        duration: "10 min",
        blocks: [
          {
            type: "prose",
            html: `<h2>Python Programming Fundamentals</h2>
<p>Build a strong Python foundation required for Data Science and Machine Learning.</p>
<h3>Module 1: Introduction</h3>
<ul>
  <li>What is Python?</li>
  <li>Why Python for AI & Machine Learning?</li>
  <li>Applications of Python</li>
  <li>Installing Python & VS Code</li>
  <li>Running Python Programs</li>
  <li>Introduction to Jupyter Notebook</li>
</ul>`
          }
        ]
      },
      {
        id: "d1-variables",
        title: "Variables & Data Types",
        duration: "15 min",
        blocks: [
          {
            type: "prose",
            html: `<h3>Module 2: Variables & Data Types</h3>
<ul>
  <li>Variables & Naming Rules</li>
  <li>Dynamic Typing</li>
  <li>int, float, string, bool</li>
</ul>`
          },
          {
            type: "sandbox",
            label: "Try it out",
            code: "x = 10\ny = 3.14\nname = 'Alice'\nis_student = True\nprint(type(x), type(name))"
          }
        ]
      },
      {
        id: "d1-io-ops",
        title: "Input/Output & Operators",
        duration: "15 min",
        blocks: [
          {
            type: "prose",
            html: `<h3>Module 3: Input & Output</h3>
<ul>
  <li>input(), print(), f-Strings</li>
</ul>
<h3>Module 4: Operators</h3>
<ul>
  <li>Arithmetic, Comparison, Logical</li>
</ul>`
          }
        ]
      },
      {
        id: "d1-control-flow",
        title: "Conditionals & Loops",
        duration: "20 min",
        blocks: [
          {
            type: "prose",
            html: `<h3>Module 5: Conditional Statements</h3>
<ul>
  <li>if, elif, else</li>
</ul>
<h3>Module 6: Loops</h3>
<ul>
  <li>for, while, range()</li>
</ul>`
          }
        ]
      },
      {
        id: "d1-functions",
        title: "Functions, Lists & Dictionaries",
        duration: "30 min",
        blocks: [
          {
            type: "prose",
            html: `<h3>Module 7: Functions</h3>
<ul>
  <li>Creating Functions, Parameters, Return Values</li>
</ul>
<h3>Module 8: Lists & Dictionaries</h3>
<ul>
  <li><strong>Lists:</strong> Create, Access, Append, Remove, Loop</li>
  <li><strong>Dictionaries:</strong> Keys, Values, Access, Update</li>
</ul>
<h3>Hands-on Practice</h3>
<ul>
  <li>Student Grade Calculator</li>
  <li>Even/Odd Checker</li>
  <li>Simple Calculator</li>
</ul>`
          }
        ]
      }
    ]
  },
  /* ── Day 2 ───────────────────────────────────────── */
  {
    id: "day-2",
    title: "Day 2 – NumPy & Pandas",
    lessons: [
      {
        id: "d2-intro",
        title: "Working with Datasets",
        duration: "10 min",
        blocks: [
          {
            type: "prose",
            html: `<h2>Objective: Learn how to work with datasets.</h2>
<h3>Introduction</h3>
<ul>
  <li>What is Data Science?</li>
  <li>Structured vs Unstructured Data</li>
  <li>CSV Files</li>
</ul>`
          }
        ]
      },
      {
        id: "d2-numpy",
        title: "NumPy",
        duration: "20 min",
        blocks: [
          {
            type: "prose",
            html: `<h3>NumPy</h3>
<ul>
  <li>Creating Arrays & Properties</li>
  <li>Indexing & Slicing</li>
  <li>Basic Operations (Mean, Sum, Max, Min)</li>
</ul>`
          }
        ]
      },
      {
        id: "d2-pandas",
        title: "Pandas",
        duration: "60 min",
        blocks: [
          {
            type: "prose",
            html: `<h3>Pandas</h3>
<ul>
  <li>Series vs DataFrame</li>
  <li>read_csv(), head(), tail(), info(), describe(), shape, columns</li>
</ul>
<h3>Data Selection & Cleaning</h3>
<ul>
  <li>Selecting Columns, loc, iloc</li>
  <li>Missing Values, isnull(), fillna()</li>
</ul>
<h3>Hands-on Practice</h3>
<p>Analyze Student Marks Dataset</p>`
          }
        ]
      }
    ]
  },
  /* ── Day 3 ───────────────────────────────────────── */
  {
    id: "day-3",
    title: "Day 3 – Data Visualization",
    lessons: [
      {
        id: "d3-matplotlib",
        title: "Matplotlib & Customization",
        duration: "90 min",
        blocks: [
          {
            type: "prose",
            html: `<h2>Objective: Understand data using charts.</h2>
<h3>Why Visualization? Matplotlib</h3>
<ul>
  <li>Line Plot, Bar Plot, Histogram, Scatter Plot</li>
</ul>
<h3>Plot Customization</h3>
<ul>
  <li>Title, Labels, Grid, Legend</li>
</ul>
<h3>Mini Activity</h3>
<p>Visualize Student Dataset:</p>
<ul>
  <li>Highest Marks</li>
  <li>Subject-wise Marks</li>
  <li>Gender Distribution</li>
  <li>Average Marks</li>
</ul>`
          }
        ]
      }
    ]
  },
  /* ── Day 4 ───────────────────────────────────────── */
  {
    id: "day-4",
    title: "Day 4 – Introduction to ML",
    lessons: [
      {
        id: "d4-intro-ml",
        title: "Machine Learning Concepts",
        duration: "30 min",
        blocks: [
          {
            type: "prose",
            html: `<h2>Objective: Understand how Machine Learning works.</h2>
<ul>
  <li>Artificial Intelligence vs Machine Learning</li>
  <li>Types of Machine Learning (Supervised, Unsupervised, Reinforcement)</li>
</ul>
<h3>Machine Learning Workflow</h3>
<p>Dataset → Cleaning → Training → Testing → Prediction → Evaluation</p>
<ul>
  <li>Features & Target</li>
  <li>Train-Test Split</li>
  <li>Introduction to Scikit-learn</li>
</ul>`
          }
        ]
      },
      {
        id: "d4-linear-reg",
        title: "Linear Regression & Evaluation",
        duration: "60 min",
        blocks: [
          {
            type: "prose",
            html: `<h3>Linear Regression</h3>
<ul>
  <li>Train Model, predict()</li>
</ul>
<h3>Evaluation</h3>
<ul>
  <li>MAE, MSE, R² Score</li>
</ul>
<h3>Hands-on</h3>
<p>Predict Student Marks or House Prices</p>`
          }
        ]
      }
    ]
  },
  /* ── Day 5 ───────────────────────────────────────── */
  {
    id: "day-5",
    title: "Day 5 – Classification",
    lessons: [
      {
        id: "d5-classification",
        title: "Logistic Regression & Evaluation",
        duration: "90 min",
        blocks: [
          {
            type: "prose",
            html: `<h2>Objective: Build your first classification model.</h2>
<h3>Regression vs Classification</h3>
<ul>
  <li>Logistic Regression Concept</li>
  <li>Binary Classification</li>
</ul>
<h3>Model Evaluation</h3>
<ul>
  <li>Accuracy, Confusion Matrix</li>
</ul>
<h3>Practical</h3>
<p>Build a Logistic Regression Model (Predict Pass/Fail, Diabetes, or Iris Flower). Compare Predictions.</p>`
          }
        ]
      }
    ]
  },
  /* ── Day 6 ───────────────────────────────────────── */
  {
    id: "day-6",
    title: "Day 6 – End-to-End Project",
    lessons: [
      {
        id: "d6-project",
        title: "Titanic or Student Prediction",
        duration: "90 min",
        blocks: [
          {
            type: "prose",
            html: `<h2>End-to-End Machine Learning Project</h2>
<p>Project: Titanic Survival Prediction or Student Performance Prediction</p>
<ol>
  <li><strong>Problem Statement</strong></li>
  <li><strong>Load Dataset</strong></li>
  <li><strong>Explore Dataset:</strong> head(), info(), describe()</li>
  <li><strong>Clean Dataset:</strong> Missing Values</li>
  <li><strong>Visualize Dataset:</strong> Histogram, Bar Chart, Scatter Plot</li>
  <li><strong>Feature Selection</strong></li>
  <li><strong>Train-Test Split</strong></li>
  <li><strong>Train Model:</strong> Logistic or Linear Regression</li>
  <li><strong>Prediction</strong></li>
  <li><strong>Evaluation:</strong> Accuracy or R² Score</li>
  <li><strong>Presentation:</strong> Problem, Dataset, Visualizations, Model, Prediction, Results</li>
</ol>`
          }
        ]
      }
    ]
  }
];

export function getFirstLesson(): Lesson {
  return ML_LAUNCHPAD_MODULE[0].lessons[0];
}

export function getLessonById(id: string): Lesson | null {
  for (const group of ML_LAUNCHPAD_MODULE) {
    const lesson = group.lessons.find((l) => l.id === id);
    if (lesson) return lesson;
  }
  return null;
}

export function getAdjacentLessons(id: string): { prev: Lesson | null; next: Lesson | null } {
  const flatLessons = ML_LAUNCHPAD_MODULE.flatMap((g) => g.lessons);
  const idx = flatLessons.findIndex((l) => l.id === id);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? flatLessons[idx - 1] : null,
    next: idx < flatLessons.length - 1 ? flatLessons[idx + 1] : null
  };
}
