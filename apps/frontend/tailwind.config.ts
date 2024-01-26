import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
    content: [
        "./src/**/*.{html,js,jsx,ts,tsx,mdx}",
        "../../node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
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
                        DEFAULT: "#AFAAC7",
                    },
                    black: {
                        1: "#050505",
                        DEFAULT: "#050505",
                    },
                    error: {
                        text: "#CE3C55",
                        bg: "rgba(206, 60, 85, 0.20)",
                    },
                },
                tremor: {
                    brand: {
                        faint: "#392D72",
                        muted: "#392D72",
                        subtle: "#28213B",
                        DEFAULT: "#392D72",
                        emphasis: "#392D72",
                        inverted: "#392D72",
                    },
                    background: {
                        muted: "#181325",
                        subtle: "#181325",
                        DEFAULT: "#181325",
                        emphasis: "#181325",
                    },
                    border: {
                        DEFAULT: "#181325",
                    },
                    ring: {
                        DEFAULT: colors.gray[200],
                    },
                    content: {
                        subtle: colors.gray[400],
                        DEFAULT: "#AFAAC7",
                        emphasis: "#AFAAC7",
                        strong: colors.gray[900],
                        inverted: colors.white,
                    },
                },
            },
            backgroundImage: {
                "gradient-button":
                    "linear-gradient(27deg, #53389E 8.33%, #6941C6 91.67%)",
                "gradient-button-hover":
                    "linear-gradient(27deg, #299532 8.33%, #7EE787 91.67%)",
            },
            borderRadius: {
                "tremor-default": "8px",
            },
        },
    },
};

export default config;

