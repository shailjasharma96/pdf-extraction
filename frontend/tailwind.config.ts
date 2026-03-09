import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Outfit", "sans-serif"],
      },
      colors: {
        brand: {
          primary: "#4f46e5",
          secondary: "#7c3aed",
          accent: "#f43f5e",
        },
      },
      borderRadius: {
        premium: "1.25rem",
      },
      boxShadow: {
        premium: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        "inner-premium": "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;