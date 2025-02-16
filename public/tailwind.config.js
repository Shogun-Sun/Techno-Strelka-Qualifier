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
        '40': '40px',
      },
      boxShadow:{
        'my': '-2px 3px 10px rgb(180,180,180)', // x, y, рассеивание
        'in': 'inset 0 0px 150px 65px rgb(0 0 0 / 0.5)',
        'pt': '4px 4px 15px 0px rgb(180 180 180 / 0.5)'
      },
      width: {
        'main': '90%',
      }
    },
  },
  plugins: [],
}