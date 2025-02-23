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
        'pt': '4px 4px 15px 0px rgb(180 180 180 / 0.5)',
        'prl':'inset 0 0px 140px 65px rgb(0 0 0 / 0.5),3px 7px 25px 0px rgb(0 0 0 /0.3), 0 8px 18px 0px rgb(0 0 0 / 0.3)',
        'prd':'inset 0 0px 140px 65px rgb(0 0 0 / 0.5),3px 3px 25px 0px rgb(2 6 23), 0 8px 20px 0px rgb(2 6 23)',
      },
      width: {
        'main': '90%',
      }
    },
  },
  plugins: [],
}