import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {ValidationPipe} from "./pipes/validation.pipe"; //Для проверки на корректный ввод


async function start() {
    const PORT = process.env.PORT || 5000; //Обьявляем порт
    const app = await NestFactory.create(AppModule) // обьявляем новое прил на nestjs принимая все модули!!!!

    const config = new DocumentBuilder() //Для Svager-а обьявл конст
        .setTitle('Урок по продвинотому BACKEND')
        .setDescription('Документация REST API')
        .setVersion('1.0.0')
        .addTag('ULBI TV')
        .build()
    const document = SwaggerModule.createDocument(app, config);  //Создаем константу документа(прил) с свагером и самим прил
    SwaggerModule.setup('/api/docs', app, document) // для настройки и развертывания интерфейса документации Swagger

    app.useGlobalPipes(new ValidationPipe()) //Подкл пайпов

    await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`)) //Проброс порта
}

start() //Запуск приложения
