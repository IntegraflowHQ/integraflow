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
          },
          text: {
            "1": "#DBD4EB",
            "2": "#DAD1EE",
            "3": "#9582C0",
          },
          error: {
            text: "#CE3C55",
            bg: "rgba(206, 60, 85, 0.20)",
          },
        },
      },
    },
  },
};

export default config;
