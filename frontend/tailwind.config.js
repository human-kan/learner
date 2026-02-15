/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        card: '#1a1a1a',
        accent: '#6366f1',
        'text-primary': '#f5f5f5',
        'text-secondary': '#a3a3a3',
      },
    },
  },
  plugins: [],
}
