/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--hairline))",
        input: "hsl(var(--hairline))",
        ring: "hsl(var(--primary-focus))",
        background: "hsl(var(--canvas))",
        foreground: "hsl(var(--ink))",
        
        canvas: "hsl(var(--canvas))",
        "surface-1": "hsl(var(--surface-1))",
        "surface-2": "hsl(var(--surface-2))",
        "surface-3": "hsl(var(--surface-3))",
        "surface-4": "hsl(var(--surface-4))",
        
        hairline: "hsl(var(--hairline))",
        "hairline-strong": "hsl(var(--hairline-strong))",
        "hairline-tertiary": "hsl(var(--hairline-tertiary))",

        ink: "hsl(var(--ink))",
        "ink-muted": "hsl(var(--ink-muted))",
        "ink-subtle": "hsl(var(--ink-subtle))",
        "ink-tertiary": "hsl(var(--ink-tertiary))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          hover: "hsl(var(--primary-hover))",
          focus: "hsl(var(--primary-focus))",
          foreground: "hsl(var(--primary-foreground))",
        },
        
        success: "hsl(var(--semantic-success))",
        overlay: "hsl(var(--semantic-overlay))",

        secondary: {
          DEFAULT: "hsl(var(--surface-1))",
          foreground: "hsl(var(--ink))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--surface-2))",
          foreground: "hsl(var(--ink-muted))",
        },
        accent: {
          DEFAULT: "hsl(var(--surface-2))",
          foreground: "hsl(var(--ink))",
        },
        popover: {
          DEFAULT: "hsl(var(--surface-2))",
          foreground: "hsl(var(--ink))",
        },
        card: {
          DEFAULT: "hsl(var(--surface-1))",
          foreground: "hsl(var(--ink))",
        },
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        pill: "var(--radius-pill)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

