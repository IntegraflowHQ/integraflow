let win: Window & typeof globalThis;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof global !== "undefined") {
    win = global as Window & typeof globalThis;
} else if (typeof self !== "undefined") {
    win = self;
} else {
    win = {} as Window & typeof globalThis;
}

export default win;
