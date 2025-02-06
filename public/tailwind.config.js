/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/*.{html,js}"],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        'text-clr': 'rgb(27, 31, 40)',
      },
      borderRadius: {
        '10': '10px', // Добавляем кастомное значение
      },
      boxShadow:{
        'my': '-2px 3px 10px rgb(180,180,180)', // x, y, рассеивание
      }
    },
  },
  plugins: [],
}