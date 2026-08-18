export const DEFAULT_API_DELAY_MS = 700;

export const simulateApiDelay = (delayMs = DEFAULT_API_DELAY_MS) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, delayMs));
