/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  theme: {
    colors: {
      transparent: 'transparent',
      dark: {
        900: '#222222',
        800: '#333343',
        700: '#444555',
        600: '#555766',
        500: '#666876',
        400: '#777a87',
        300: '#898c98',
        200: '#9b9ea8',
        100: '#adb0b8',
      },
      light: {
        900: '#F8F8E0',
        800: '#ECEBD4',
        700: '#E1DDC8',
        600: '#D5D0BC',
        500: '#C9C2B0',
        400: '#BDB5A5',
        300: '#B1A799',
        200: '#A59A8E',
        100: '#998D82',
      },
    }
  }
}

