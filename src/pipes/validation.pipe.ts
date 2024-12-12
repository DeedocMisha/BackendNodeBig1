import {ArgumentMetadata, Injectable, PipeTransform} from "@nestjs/common";
import {plainToClass} from "class-transformer";
import {validate} from "class-validator";
import {ValidationException} from "../exceptions/validation.exception";

/*
Это класс иньекция для проверки любых символов на корректность ввода!
*
metadata- Имя аршумента (например, название параметра, его метатип и т.д.)
*
value-значение передаваемого параметра
* */
@Injectable()
export class ValidationPipe implements PipeTransform<any> {//Исп validation exeption
    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {//Метод возвращает Promise, что означает, что результат будет доступен только по завершении асинхронной операции.
        const obj = plainToClass(metadata.metatype, value);//Преобразовываем данные неизв типа в те, которые передавали
        const errors = await validate(obj); //validete проверяет объект на наличие ошибок

        if (errors.length>0) {
            let messages = errors.map(err => {//Проходит по всем ошибкам валидации и создает новый массив, который будет содержать сообщения для каждой ошибки.
                return `${err.property} - ${Object.values(err.constraints).join(', ')}`
                /*
                err.property: Указывает на имя свойства объекта, которое вызвало ошибку.
                Object.values(err.constraints).join(', '): Извлекает значения всех ограничений (constraints) для текущего свойства и объединяет их в строку, разделенную запятыми. Эти ограничения представляют собой описания того, почему валидация не прошла.
                */
            })
            throw new ValidationException(messages) //Выбрасывание ошибки
        }
        return value;
    }

}
