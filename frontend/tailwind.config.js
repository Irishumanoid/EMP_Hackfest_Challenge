/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'glow': '0px 0px 10px 0px rgba(0, 0, 0, 0.3)',
        'glow-lg': '0px 0px 20px 0px rgba(0, 0, 0, 0.3)',
      },
      colors: {
        primary: {
          '50': '#f3f3ff',
          '100': '#eae9fe',
          '200': '#d8d6fe',
          '300': '#bab5fd',
          '400': '#988bfa',
          '500': '#765cf6',
          '600': '#643aed',
          '700': '#5528d9',
          '800': '#4721b6',
          '900': '#3c1d95',
          '950': '#231065',
        },
        dark: {
          100: "#010C1F",
          200: "#041023",
          300: "#081428",
          400: "#0C182D",
          500: "#101D32",
          600: "#142136",
          700: "#18253B",
          800: "#1C2940",
          900: "#202E45",
        },
        light: {
          100: "#FFFFFF",
          200: "#F2F1FF",
          300: "#E5E3FF",
          400: "#D9D5FF",
          500: "#CCC7FF",
          600: "#BFB9FF",
          700: "#B3ABFF",
          800: "#A69DFF",
          900: "#9A8FFF",
        }
      }
    },
  },
  plugins: [],
}

