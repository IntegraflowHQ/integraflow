import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}",  
  './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  './src/ui/**/*.{js,ts,jsx,tsx,mdx}', 
 ],
  theme: {
    extend: {
      colors:{
        intg:{
        "bg":{
          "1": "#21173A",
        },
        "text":{
          "1":"#DBD4EB",
          "2": "#DAD1EE",
          "3": "#9582C0"
        }
      }
      }
    },
  },
};

export default config;
