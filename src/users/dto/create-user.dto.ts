import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";

export class CreateUserDto { //Создание пользователя!

    @ApiProperty({example: 'user@mail.ru', description: 'Почта'}) //Для свагера
    @IsString({message: 'Должно быть строкой'})//Валидатор
    @IsEmail({}, {message: "Некорректный email"})//Валидатор
    readonly email: string;

    @ApiProperty({example: '12345', description: 'пароль'}) //Для свагера
    @IsString({message: 'Должно быть строкой'}) //Валидатор
    @Length(4, 16, {message: 'Не меньше 4 и не больше 16'})//Валидатор
    readonly password: string;
}
