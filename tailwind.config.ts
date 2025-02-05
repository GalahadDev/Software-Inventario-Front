import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-scale': 'pulse-scale 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "blue-1000": "#010a1d"
      },
    },
  },
  plugins: [],
} satisfies Config;
