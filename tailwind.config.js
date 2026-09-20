/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        papel: "#F1E7CE",
        crema: "#FAF3E1",
        tinta: "#2E2B27",
        grana: "#B23A2E",
        azul: "#1E3A5F",
        mostaza: "#C99B2E",
        lineacream: "#CBB98E",
        cremades: "#3A3630",
      },
      fontFamily: {
        display: ["'Alfa Slab One'", "serif"],
        body: ["Lora", "ui-serif", "Georgia", "serif"],
      },
      boxShadow: {
        cardglow3: "0 24px 50px -24px rgba(46,43,39,.45)",
        soltar: "0 18px 34px -20px rgba(46,43,39,.55)",
        rojo: "0 18px 34px -20px rgba(178,58,46,.55)",
      },
    },
  },
  plugins: [],
}