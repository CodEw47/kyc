export interface Storage {
  setItem<T>(key: string, data: T): void
  removeItem(key: string): void
  getItem<T>(key: string): T | null
}

export const storage: Storage = {
  getItem<T>(key: string) {
    const item = localStorage.getItem(key)
    if (item) {
      return JSON.parse(item) as T
    }
    return null
  },
  removeItem(key: string) {
    localStorage.removeItem(key)
  },
  setItem<T>(key: string, data: T) {
    localStorage.setItem(key, typeof data === 'string' ? data : JSON.stringify(data))
  }
}
