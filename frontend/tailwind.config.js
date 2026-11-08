/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        industrial: {
          bg: {
            dark: '#080c14',
            light: '#f8fafc',
          },
          panel: {
            dark: '#0e1524',
            light: '#ffffff',
          },
          panel2: {
            dark: '#131b2e',
            light: '#f1f5f9',
          },
          border: {
            dark: '#1c2842',
            light: '#e2e8f0',
          },
          border2: {
            dark: '#27385c',
            light: '#cbd5e1',
          }
        },
        risk: {
          normal: '#10b981',
          warning: '#f59e0b',
          critical: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
