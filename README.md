## Инструкция по запуску приложения Techno-Strelka-Qualifier

**1. Предварительные требования:**

**Node.js и npm:**  Убедитесь, что у вас установлен Node.js версии 14 или выше, а также npm.  Вы можете проверить установленную версию Node.js, выполнив в терминале команду `node -v`.  Если Node.js не установлен, скачать его можно с официального сайта [nodejs.org](https://nodejs.org/). Пакетный мэнэджер npm устанавливается вместе с NodeJS.

**2. Клонирование репозитория:**

Клонирование с использованием ssh

```bash
git clone git@github.com:Shogun-Sun/Techno-Strelka-Qualifier.git
cd Techno-Strelka-Qualifier
```

Клонирование с ипользованием https:

```bash
git clone https://github.com/Shogun-Sun/Techno-Strelka-Qualifier.git
cd Techno-Strelka-Qualifier
```

**3. Установка зависимостей:**

В корне проекта перейдите в директорию `public` и установите необходимые пакеты:

```bash
cd public
npm install
```

В корне проекта перейдите в директорию `server` и установите необходимые пакеты:

```bash
cd server
npm install
```

**3. Настройка Tailwind**


**4. Запуск сервера:**

Для запуска приложения, требуется зайти в директорию *server* и выполнить в терминале:

```plaintext
npm start 
```

После успешного запуска сервера, приложение будет доступно по адресу http://localhost:3000
Поорт можно изменить в файле .env:

```plaintext
PORT=3000 //Изменить на нужный порт
```
