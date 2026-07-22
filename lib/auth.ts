// ── Auth Library ─────────────────────────────────────────────────
// Pure localStorage-based auth. No backend required.
// Passwords hashed with SHA-256 via crypto.subtle before storage.

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: number;
}

export interface Session {
  userId: string;
  email: string;
  name: string;
  createdAt: number;
}

export type UserProgress = Record<string, boolean>; // lessonId → completed

const USERS_KEY = "pyvisuals_users";
const SESSION_KEY = "pyvisuals_session";
const PROGRESS_KEY_PREFIX = "pyvisuals_progress_";

// ── Hashing ──────────────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "pyvisuals_salt_2024");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ── User Storage ─────────────────────────────────────────────────

function getUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ── Auth Operations ──────────────────────────────────────────────

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<{ success: true; session: Session } | { success: false; error: string }> {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some((u) => u.email === normalizedEmail)) {
    return { success: false, error: "An account with this email already exists." };
  }

  const passwordHash = await hashPassword(password);
  const user: User = {
    id: generateId(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    createdAt: Date.now(),
  };

  saveUsers([...users, user]);

  const session = createSessionFor(user);
  return { success: true, session };
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ success: true; session: Session } | { success: false; error: string }> {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find((u) => u.email === normalizedEmail);

  if (!user) {
    return { success: false, error: "No account found with this email." };
  }

  const hash = await hashPassword(password);
  if (hash !== user.passwordHash) {
    return { success: false, error: "Incorrect password." };
  }

  const session = createSessionFor(user);
  return { success: true, session };
}

// ── Session ──────────────────────────────────────────────────────

function createSessionFor(user: User): Session {
  const session: Session = {
    userId: user.id,
    email: user.email,
    name: user.name,
    createdAt: Date.now(),
  };
  saveSession(session);
  return session;
}

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: Session): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

// ── Progress ─────────────────────────────────────────────────────

export function getUserProgress(userId: string): UserProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY_PREFIX + userId);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveUserProgress(userId: string, lessonId: string, completed: boolean): void {
  const progress = getUserProgress(userId);
  progress[lessonId] = completed;
  localStorage.setItem(PROGRESS_KEY_PREFIX + userId, JSON.stringify(progress));
}

export function isLessonCompleted(userId: string | undefined, lessonId: string): boolean {
  if (!userId) return false;
  return getUserProgress(userId)[lessonId] === true;
}
