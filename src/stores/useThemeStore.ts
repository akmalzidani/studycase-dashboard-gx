import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  __theme: Theme;
  __isDarkMode: boolean;
  __handleToggleTheme: () => void;
  __handleSetTheme: (theme: Theme) => void;
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
    __theme: theme,
    __isDarkMode: theme === "dark",
    __handleToggleTheme: () =>
      set((state) => {
        const nextTheme = state.__theme === "light" ? "dark" : "light";
        applyThemeToDocument(nextTheme);
        return { __theme: nextTheme, __isDarkMode: nextTheme === "dark" };
      }),
    __handleSetTheme: (__theme) => {
      applyThemeToDocument(__theme);
      set({ __theme, __isDarkMode: __theme === "dark" });
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
          __theme: newTheme,
          __isDarkMode: newTheme === "dark",
        });
      }
    }
  });
}
