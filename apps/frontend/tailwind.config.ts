import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/ui/**/*.{js,ts,jsx,tsx,mdx}",
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
            "12": "#261F36",
            "13": "#272138",
            "14": "#6941C6",
            "15": "#322751",
          },
          text: {
            "1": "#DBD4EB",
            "2": "#DAD1EE",
            "3": "#9582C0",
            "4": "#AFAAC7",
            "5": "#F2F2F2",
            "6": "#B5A4DB",
            "7": "#F1F1F1",
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
      },
      backgroundImage: {
        "gradient-button":
          "linear-gradient(27deg, #53389E 8.33%, #6941C6 91.67%)",
        "gradient-button-hover":
          "linear-gradient(27deg, #299532 8.33%, #7EE787 91.67%)",
      },
    },
  },
};

export default config;
