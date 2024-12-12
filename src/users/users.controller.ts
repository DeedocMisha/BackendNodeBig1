import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersService} from "./users.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "./users.model";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {AddRoleDto} from "./dto/add-role.dto";
import {BanUserDto} from "./dto/ban-user.dto";

/*
Вывод 200
Передача с тела запроса данных!!!
*/

@ApiTags('Пользователи')//Swager
@Controller('users') //класс как контроллер с базовым маршрутом '/users'.
export class UsersController {

    constructor(private usersService: UsersService) {} //Внедрение в экспорт класса юзерсервиса где есть все ф-ии

    @ApiOperation({summary: 'Создание пользователя'})//Swagger
    @ApiResponse({status: 200, type: User})
    @Post() //Если пост запрос
    create(@Body() userDto: CreateUserDto) { //Create это не ф-я а команда!!!  Метод для создания пользователя, принимает данные из тела запроса
        return this.usersService.createUser(userDto); // Вызов сервиса для создания пользователя с переданными данными
    }

    @ApiOperation({summary: 'Получить всех пользователей'})//Swagger
    @ApiResponse({status: 200, type: [User]})
    @Roles("ADMIN")//Дост только админам!!!
    @UseGuards(RolesGuard)
    @Get()
    getAll() {
        return this.usersService.getAllUsers();
    }

    @ApiOperation({summary: 'Выдать роль'})//Swagger
    @ApiResponse({status: 200})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Post('/role')//Добавочный путь!!!
    addRole(@Body() dto: AddRoleDto) {
        return this.usersService.addRole(dto);
    }

    @ApiOperation({ summary: 'Забанить пользователя' }) // Swagger
    @ApiResponse({ status: 200, description: 'Пользователь успешно забанен.' })
    @ApiResponse({ status: 400, description: 'Неверные данные для бана.' })
    @ApiResponse({ status: 404, description: 'Пользователь не найден.' })
    @ApiResponse({ status: 500, description: 'Ошибка сервера.' })
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Post('/ban')
    ban(@Body() dto: BanUserDto) {
        return this.usersService.ban(dto);
    }
}
