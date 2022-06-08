module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Rubik"],
      },
      colors: {
        'dark-gray': {
          100: 'hsl(0, 0%, 59%)',
          500: 'hsl(0, 0%, 17%)',
        },
      },
      backgroundImage: {
        'header': "url('/src/assets/images/pattern-bg.png')",
      }
    },
  },
  plugins: [],
}