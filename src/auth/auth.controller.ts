import {Body, Controller, Post} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {AuthService} from "./auth.service";

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('/login') //Определяем путь
    login(@Body() userDto: CreateUserDto) {//Получем данные из Тела и проверяем с ДТО
        return this.authService.login(userDto) //Передаем и возвращаем данные из ф-ии
    }

    @Post('/registration') //Определяем путь
    registration(@Body() userDto: CreateUserDto) { //Получем данные из Тела и проверяем с ДТО
        return this.authService.registration(userDto)//Передаем и возвращаем данные из ф-ии
    }
}
