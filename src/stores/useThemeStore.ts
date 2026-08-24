import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// Helper function to apply the attribute to the document element
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

export const useThemeStore = create<ThemeState>((set) => {
  const theme = getInitialTheme();

  return {
    theme,
    isDarkMode: theme === "dark",
    toggleTheme: () =>
      set((state) => {
        const nextTheme = state.theme === "light" ? "dark" : "light";
        applyThemeToDocument(nextTheme);
        return { theme: nextTheme, isDarkMode: nextTheme === "dark" };
      }),
    setTheme: (theme) => {
      applyThemeToDocument(theme);
      set({ theme, isDarkMode: theme === "dark" });
    },
  };
});

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "theme") {
      const newTheme = e.newValue as Theme;
      if (newTheme === "light" || newTheme === "dark") {
        document.documentElement.dataset.bsTheme = newTheme;
        useThemeStore.setState({
          theme: newTheme,
          isDarkMode: newTheme === "dark",
        });
      }
    }
  });
}
