import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// Function helper untuk menerapkan atribut ke document element
function applyThemeToDocument(theme: Theme) {
  document.documentElement.dataset.bsTheme = theme;
  localStorage.setItem("theme", theme);
}

function getInitialTheme(): Theme {
  const savedTheme = localStorage.getItem("theme") as Theme | null;
  if (savedTheme === "light" || savedTheme === "dark") {
    applyThemeToDocument(savedTheme);
    return savedTheme;
  }
  applyThemeToDocument("light");
  return "light";
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === "light" ? "dark" : "light";
      applyThemeToDocument(nextTheme);
      return { theme: nextTheme };
    }),
  setTheme: (newTheme) => {
    applyThemeToDocument(newTheme);
    set({ theme: newTheme });
  },
}));

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "theme") {
      const newTheme = e.newValue as Theme;
      if (newTheme === "light" || newTheme === "dark") {
        document.documentElement.dataset.bsTheme = newTheme;
        useThemeStore.setState({ theme: newTheme });
      }
    }
  });
}
