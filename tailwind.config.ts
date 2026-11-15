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
        paper: "var(--paper)",
        "paper-deep": "var(--paper-deep)",
        rule: "var(--rule)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        tintenblau: "var(--tintenblau)",
        rotstift: "var(--rotstift)",
        moos: "var(--moos)",
        textmarker: "var(--textmarker)",
        grammar: {
          nom: "var(--case-nom)",
          akk: "var(--case-akk)",
          dat: "var(--case-dat)",
          gen: "var(--case-gen)",
          verb: "var(--case-verb)",
          prefix: "var(--case-prefix)",
        },
      },
      fontFamily: {
        serif: ["var(--font-reading)", "Georgia", "serif"],
        sans: ["var(--font-interface)", "'Avenir Next'", "sans-serif"],
        fraktur: ["var(--font-fraktur)", "serif"],
      },
      borderRadius: {
        DEFAULT: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
