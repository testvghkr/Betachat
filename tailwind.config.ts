import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "rgb(var(--md-sys-color-outline-variant))",
        input: "rgb(var(--md-sys-color-surface-container-highest))",
        ring: "rgb(var(--md-sys-color-primary))",
        background: "rgb(var(--md-sys-color-background))",
        foreground: "rgb(var(--md-sys-color-on-background))",
        primary: {
          DEFAULT: "rgb(var(--md-sys-color-primary))",
          foreground: "rgb(var(--md-sys-color-on-primary))",
        },
        secondary: {
          DEFAULT: "rgb(var(--md-sys-color-secondary))",
          foreground: "rgb(var(--md-sys-color-on-secondary))",
        },
        destructive: {
          DEFAULT: "rgb(var(--md-sys-color-error))",
          foreground: "rgb(var(--md-sys-color-on-error))",
        },
        muted: {
          DEFAULT: "rgb(var(--md-sys-color-surface-variant))",
          foreground: "rgb(var(--md-sys-color-on-surface-variant))",
        },
        accent: {
          DEFAULT: "rgb(var(--md-sys-color-tertiary))",
          foreground: "rgb(var(--md-sys-color-on-tertiary))",
        },
        popover: {
          DEFAULT: "rgb(var(--md-sys-color-surface-container))",
          foreground: "rgb(var(--md-sys-color-on-surface))",
        },
        card: {
          DEFAULT: "rgb(var(--md-sys-color-surface-container))",
          foreground: "rgb(var(--md-sys-color-on-surface))",
        },
        // Material 3 specific colors
        "primary-container": "rgb(var(--md-sys-color-primary-container))",
        "on-primary-container": "rgb(var(--md-sys-color-on-primary-container))",
        "secondary-container": "rgb(var(--md-sys-color-secondary-container))",
        "on-secondary-container": "rgb(var(--md-sys-color-on-secondary-container))",
        "tertiary-container": "rgb(var(--md-sys-color-tertiary-container))",
        "on-tertiary-container": "rgb(var(--md-sys-color-on-tertiary-container))",
        "error-container": "rgb(var(--md-sys-color-error-container))",
        "on-error-container": "rgb(var(--md-sys-color-on-error-container))",
        surface: "rgb(var(--md-sys-color-surface))",
        "on-surface": "rgb(var(--md-sys-color-on-surface))",
        "surface-variant": "rgb(var(--md-sys-color-surface-variant))",
        "on-surface-variant": "rgb(var(--md-sys-color-on-surface-variant))",
        "surface-container": "rgb(var(--md-sys-color-surface-container))",
        "surface-container-low": "rgb(var(--md-sys-color-surface-container-low))",
        "surface-container-high": "rgb(var(--md-sys-color-surface-container-high))",
        "surface-container-highest": "rgb(var(--md-sys-color-surface-container-highest))",
        "surface-container-lowest": "rgb(var(--md-sys-color-surface-container-lowest))",
        outline: "rgb(var(--md-sys-color-outline))",
        "outline-variant": "rgb(var(--md-sys-color-outline-variant))",
        "inverse-surface": "rgb(var(--md-sys-color-inverse-surface))",
        "inverse-on-surface": "rgb(var(--md-sys-color-inverse-on-surface))",
        "inverse-primary": "rgb(var(--md-sys-color-inverse-primary))",
        shadow: "rgb(var(--md-sys-color-shadow))",
        scrim: "rgb(var(--md-sys-color-scrim))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
