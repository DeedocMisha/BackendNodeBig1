# Используем образ Node.js версии 18 для этапа сборки
FROM node:18 as build

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /opt/app

# Копируем package.json и package-lock.json для установки зависимостей
ADD package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все остальные файлы в контейнер
ADD . .


# Запускаем команду сборки приложения. --prod указывает на сборку для производства
RUN npm run build --prod


# Новый этап для создания финального образа
FROM node:18
# Устанавливаем рабочую директорию для финального образа
WORKDIR /opt/app

# Копируем файлы сборки из первого этапа
COPY --from=build /opt/app/dist ./dist

# Копируем package.json и package-lock.json для установки только нужных зависимостей
ADD package*.json ./

# Устанавливаем только производственные зависимости
RUN npm ci --omit=dev

# Указываем команду для запуска приложения
CMD ["node", "./dist/main.js"]


#docker build -t profi-backend-node-js .
#docker run -d --name profi-backend-node-js -p 3000:3000 profi-backend-node-js