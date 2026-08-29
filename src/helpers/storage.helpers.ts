export function getStoredJson<T>(key: string): T | null {
  try {
    const value = localStorage.getItem(key);

    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

export function setStoredJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeStoredValue(key: string) {
  localStorage.removeItem(key);
}
