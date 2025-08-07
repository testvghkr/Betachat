import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Material 3 Color Palette - Light Theme
        primary: '#6750A4',
        'on-primary': '#FFFFFF',
        'primary-container': '#EADDFF',
        'on-primary-container': '#21005D',
        secondary: '#625B71',
        'on-secondary': '#FFFFFF',
        'secondary-container': '#E8DEF8',
        'on-secondary-container': '#1D192B',
        tertiary: '#7D5260',
        'on-tertiary': '#FFFFFF',
        'tertiary-container': '#FFD8E4',
        'on-tertiary-container': '#31111D',
        error: '#BA1A1A',
        'on-error': '#FFFFFF',
        'error-container': '#FFDAD6',
        'on-error-container': '#410002',
        background: '#FFFBFF',
        'on-background': '#1C1B1F',
        surface: '#FFFBFF',
        'on-surface': '#1C1B1F',
        'surface-variant': '#E7E0EC',
        'on-surface-variant': '#49454F',
        outline: '#79747E',
        'inverse-on-surface': '#F4EFF4',
        'inverse-surface': '#313033',
        'inverse-primary': '#D0BCFF',
        shadow: '#000000',
        'surface-tint': '#6750A4',
        'outline-variant': '#CAC4D0',
        'scrim': '#000000',
        'surface-container-lowest': '#FFFFFF',
        'surface-container-low': '#F7F2FA',
        'surface-container': '#F3EDF7',
        'surface-container-high': '#ECE6F0',
        'surface-container-highest': '#E6E0E9',

        // Shadcn default colors (adjusted to fit Material 3 where applicable)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
