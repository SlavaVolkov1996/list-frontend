FROM node:16-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

RUN rm -rf dist
COPY . /app

RUN npm run ng build --configuration=production

FROM nginx:alpine as server

COPY --from=builder /app/dist/todo-frontend /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
