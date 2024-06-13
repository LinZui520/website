import type { Config } from "tailwindcss";

import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      height: {
        'calc-84': 'calc(100vh - 84px)'
      },
      width: {
        'calc-150': 'calc(100vw - 150px)',
        'calc-64': 'calc(100vw - 64px)'
      },
      screens: {
        'sm': { 'max': '767px' },
        'md': { 'min': '768px', 'max': '1023px' },
        'lg': { 'min': '1024px' }
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()]
};
export default config;
