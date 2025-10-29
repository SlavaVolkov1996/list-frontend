# Этап 1: Сборка Angular приложения
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем package.json
COPY package.json ./

# Устанавливаем зависимости обычным способом
RUN npm install

# Копируем исходный код
COPY . .

# Собираем приложение для продакшена
RUN npm run build -- --configuration production

# Этап 2: Настройка nginx для раздачи статических файлов
FROM nginx:alpine

# Копируем собранное приложение из предыдущего этапа
COPY --from=builder /app/dist/todo-frontend /usr/share/nginx/html

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Экспонируем порт 80
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]