class Cache {
    private keys: Set<string> = new Set();

    getItem(key: string): string | null {
        const item = sessionStorage.getItem(key);
        if (!item) {
            return localStorage.getItem(key);
        }

        return item;
    }

    setItem(key: string, value: string): void {
        this.keys.add(key);
        sessionStorage.setItem(key, value);
        localStorage.setItem(key, value);
    }

    removeItem(key: string): void {
        this.keys.delete(key);
        sessionStorage.removeItem(key);
        localStorage.removeItem(key);
    }

    clear(): void {
        this.keys.forEach((key) => this.removeItem(key));
    }
}

export const userCache = new Cache();
