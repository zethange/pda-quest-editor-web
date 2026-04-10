type EachCallback<T = any> = (key: string, value: T) => boolean | void;

const parseValue = (raw: string | null): any => {
  if (raw === null) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
};

const stringifyValue = (value: any): string => {
  if (typeof value === "string") return value;
  return JSON.stringify(value);
};

const storage = {
  get<T = any>(key: string | null | undefined): T | null {
    if (!key) return null;
    return parseValue(localStorage.getItem(key)) as T | null;
  },
  set(key: string, value: any, _overwrite?: boolean): void {
    localStorage.setItem(key, stringifyValue(value));
  },
  remove(key: string): void {
    localStorage.removeItem(key);
  },
  each<T = any>(callback: EachCallback<T>): void {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      const shouldBreak = callback(key, parseValue(localStorage.getItem(key)));
      if (shouldBreak === false) break;
    }
  },
};

export default storage;
