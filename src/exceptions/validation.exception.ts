import {HttpException, HttpStatus} from "@nestjs/common";

export class ValidationException extends HttpException { // Определяем класс ValidationException, который наследует HttpException
    messages;//Принимает сообщения
    constructor(response) {
        super(response, HttpStatus.BAD_REQUEST); // Вызываем конструктор родительского класса (HttpException) с ответом и статусом 400 (BAD_REQUEST)
        this.messages = response // Присваиваем переданный response в свойство messages
    }
}
