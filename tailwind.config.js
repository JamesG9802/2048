/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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
        tiletext: {
          2: '#444555',
          4: '#444555',
          8: '#f9f6f2',
          16: '#f9f6f2',
          32: '#f9f6f2',
          64: '#f9f6f2',
          128: '#f9f6f2',
          256: '#f9f6f2',
          512: '#f9f6f2',
          1024: '#f9f6f2',
          2048: '#f9f6f2',
          4096: '#f9f6f2'
        },
        tilebg: {
          2: '#eee4da',
          4: '#ede0c8',
          8: '#f2b179',
          16: '#f59563',
          32: '#f67c5f',
          64: '#f65e3b',
          128: '#edcf72',
          256: '#edcc61',
          512: '#edc850',
          1024: '#edc53f',
          2048: '#edc22e',
          4096: '#3c3a32'
        }
      }
    }
  },
  plugins: []
}

