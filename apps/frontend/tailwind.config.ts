import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
    content: ["./src/**/*.{html,js,jsx,ts,tsx,mdx}", "../../node_modules/@tremor/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", ...defaultTheme.fontFamily.sans],
            },
            screens: {
                "3xl": "1920px",
            },
            colors: {
                intg: {
                    bg: {
                        "1": "#21173A",
                        "2": "#53389E",
                        "3": "#322751",
                        "4": "#2F254B",
                        "5": "#1E1B2F",
                        "6": "#2A2740",
                        "7": "#443862",
                        "8": "#150E27",
                        "9": "#181325",
                        "10": "#392D72",
                        "11": "#312848",
                        "12": "#231E35",
                        "13": "#4D4267",
                        "14": "#261F36",
                        "15": "#272138",
                        "16": "#372e4f",
                        "17": "#d9d9d9",
                        "18": "#38304f",
                        "19": "#352E48",
                        "20": "#524B52",
                        "21": "#2E2743",
                        "22": "#201A2C",
                        "23": "#3C2D60",
                        "24": "#6941C6",
                    },
                    text: {
                        "1": "#DBD4EB",
                        "2": "#DAD1EE",
                        "3": "#9582C0",
                        "4": "#AFAAC7",
                        "5": "#F2F2F2",
                        "6": "#B5A4DB",
                        "7": "#F1F1F1",
                        "8": "#7F76A9",
                        "9": "#EED294",
                        "10": "#827BA3",
                        "11": "#D8D4FF",
                        "12": "#705F97",
                        "13": "#847F98",
                        DEFAULT: "#AFAAC7",
                    },
                    green: {
                        light: "#8DF0B0",
                        medium: "#7EE787",
                        dark: "#299532",
                        DEFAULT: "#299532",
                    },
                    black: {
                        1: "#050505",
                        DEFAULT: "#050505",
                    },
                    error: {
                        text: "#CE3C55",
                        bg: "rgba(206, 60, 85, 0.20)",
                    },
                    chart: {
                        positive: "#8DF0B0",
                        neutral: "#FFB17B",
                        negative: "#EB5A6D",
                    },
                },
            },
            backgroundImage: {
                "gradient-text": "linear-gradient(27deg, #B7A6E8 8.33%, #6941C6 91.67%)",
                "gradient-button": "linear-gradient(27deg, #53389E 8.33%, #6941C6 91.67%)",
                "gradient-button-hover": "linear-gradient(27deg, #299532 8.33%, #7EE787 91.67%)",
            },
        },
    },
    safelist: [
        {
            pattern:
                /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
            variants: ["hover", "ui-selected"],
        },
        {
            pattern:
                /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
            variants: ["hover", "ui-selected"],
        },
        {
            pattern:
                /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
            variants: ["hover", "ui-selected"],
        },
        {
            pattern:
                /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
        },
        {
            pattern:
                /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
        },
        {
            pattern:
                /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
        },
        ...["[#EB5A6D]", "[#FFB17B]", "[#8DF0B0]", "[#5D45DB]", "[#A698EB]", "[#D3CCF5]"].flatMap((customColor) => [
            `bg-${customColor}`,
            `border-${customColor}`,
            `hover:bg-${customColor}`,
            `hover:border-${customColor}`,
            `hover:text-${customColor}`,
            `fill-${customColor}`,
            `ring-${customColor}`,
            `stroke-${customColor}`,
            `text-${customColor}`,
            `ui-selected:bg-${customColor}`,
            `ui-selected:border-${customColor}`,
            `ui-selected:text-${customColor}`,
        ]),
    ],
};

export default config;
