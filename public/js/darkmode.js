document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('theme-toggle');
    const body = document.body;

    // Функция для переключения темы
    function toggleTheme() {
      if (localStorage.getItem('theme') === 'dark') {
        localStorage.setItem('theme', 'light');
        body.classList.remove('dark');
      } else {
        localStorage.setItem('theme', 'dark');
        body.classList.add('dark');
      }
    }

    // Начальная инициализация темы
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
      body.classList.add('dark');
    }

    // Добавление обработчика событий для кнопки
    toggleButton.addEventListener('click', toggleTheme);
  });