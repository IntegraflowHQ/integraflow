import Cookies from 'js-cookie';

class CookieStorage {
  private keys: Set<string> = new Set();

  getItem(key: string): string | null {
    const item = Cookies.get(key);
    if (!item) {
      return null;
    }

    return item;
  }

  setItem(key: string, value: string, attributes?: Cookies.CookieAttributes): void {
    this.keys.add(key);
    Cookies.set(key, value, attributes);
  }

  removeItem(key: string): void {
    this.keys.delete(key);
    Cookies.remove(key);
  }

  clear(): void {
    this.keys.forEach((key) => this.removeItem(key));
  }
}

export const cookieStorage = new CookieStorage();
