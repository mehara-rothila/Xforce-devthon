/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd", 
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
        dark: {
          100: "#1E1E1E",
          200: "#2D2D2D",
          300: "#3D3D3D",
          400: "#4D4D4D",
          500: "#5D5D5D",
          card: "#1E1E1E",
          border: "#333333",
        }
      },
      backgroundImage: {
        'hero-pattern': "url('/images/hero-bg.svg')",
        'dots-pattern': "url('/images/dots.svg')",
        'hero-dark': "linear-gradient(to bottom right, #4c1d95, #2e1065)",
      },
      boxShadow: {
        'game': '0 10px 15px -3px rgba(107, 70, 193, 0.2), 0 4px 6px -4px rgba(107, 70, 193, 0.2)',
        'game-dark': '0 10px 15px -3px rgba(139, 92, 246, 0.15), 0 4px 6px -4px rgba(139, 92, 246, 0.15)',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
    },
  },
  plugins: [],
};