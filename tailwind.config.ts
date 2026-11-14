import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{json,js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        grammar: {
          nom: {
            bg: "#eff6ff",
            border: "#93c5fd",
            text: "#1d4ed8",
            badge: "#dbeafe",
          },
          akk: {
            bg: "#fef2f2",
            border: "#fca5a5",
            text: "#b91c1c",
            badge: "#fee2e2",
          },
          dat: {
            bg: "#fffbeb",
            border: "#fcd34d",
            text: "#b45309",
            badge: "#fef3c7",
          },
          gen: {
            bg: "#f0fdf4",
            border: "#86efac",
            text: "#15803d",
            badge: "#dcfce7",
          },
          verb: {
            bg: "#faf5ff",
            border: "#d8b4fe",
            text: "#7e22ce",
            badge: "#f3e8ff",
          },
          prefix: {
            bg: "#fdf4ff",
            border: "#f0abfc",
            text: "#a21caf",
            badge: "#fae8ff",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
