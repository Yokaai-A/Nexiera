export type Theme = "light" | "dark";

export function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const stored = localStorage.getItem("nexiera_theme") as Theme | null;
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function applyTheme(theme: Theme) {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") {
    root.setAttribute("data-theme", "dark");
    root.classList.add("dark");
  } else {
    root.setAttribute("data-theme", "light");
    root.classList.remove("dark");
  }
  try {
    localStorage.setItem("nexiera_theme", theme);
  } catch {}
  window.dispatchEvent(new CustomEvent("nexiera_theme_change", { detail: { theme } }));
}
