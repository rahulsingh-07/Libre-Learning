/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      screens: { 
        xlg: "1300px", // Define custom screen size here
      xxlg:"1800px"},
    },
  },
  plugins: [],
}

