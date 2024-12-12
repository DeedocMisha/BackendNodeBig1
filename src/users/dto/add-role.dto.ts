import {IsNumber, IsString} from "class-validator";

export class AddRoleDto { //Экспортиируем класс для доб ролей
    @IsString({message: "Должно быть строкой"})
    readonly value: string; //Значение может быть присвоено только 1 раз!!!
    @IsNumber({}, {message: "Должно быть числом"})
    readonly userId: number;
}
