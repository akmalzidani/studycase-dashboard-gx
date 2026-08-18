import { useEffect } from "react";
import { useMatches } from "react-router-dom";

export function usePageTitle(): string {
  const matches = useMatches();

  const match = matches.at(-1);

  const currentTitle =
    (match?.handle as { title?: string })?.title || "Dashboard";

  useEffect(() => {
    document.title = `${currentTitle} | LearnDashboard`;
  }, [currentTitle]);

  return currentTitle;
}
