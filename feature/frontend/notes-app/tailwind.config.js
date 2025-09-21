/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./frontend/notes-app/index.html"
  ],
  theme: {
    extend: {
      primary: "#2563EB",
      secondary: "#10B981",
    },
  },
  plugins: [],
}

