FROM node:18-alpine

WORKDIR /app
COPY . .
RUN npm install && npm run build:prod

FROM nginx:alpine
COPY --from=0 /app/dist/todo-frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]