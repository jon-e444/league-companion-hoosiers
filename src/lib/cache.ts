interface Entry<T> { value: T; exp: number; }
const store = new Map<string, Entry<unknown>>();
export const cache = {
  get<T>(key: string): T | null {
    const e = store.get(key) as Entry<T> | undefined;
    if (!e) return null;
    if (Date.now() > e.exp) { store.delete(key); return null; }
    return e.value;
  },
  set<T>(key: string, value: T, ttl = 1000 * 60 * 60 * 6): void {
    store.set(key, { value, exp: Date.now() + ttl });
  },
};
