import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {User} from "./users.model";
import {InjectModel} from "@nestjs/sequelize";
import {CreateUserDto} from "./dto/create-user.dto";
import {RolesService} from "../roles/roles.service";
import {AddRoleDto} from "./dto/add-role.dto";
import {BanUserDto} from "./dto/ban-user.dto";
/*
В ДТО ПРОКИД ДАННЫЕ ИЗ ТЕЛА ЗАПРОСА И ПРОВЕРЯЮТСЯ НА КОРРЕКТНОСТЬ
 */
@Injectable() //сервис, который может быть внедрен в другие компоненты.
export class UsersService {

    constructor(@InjectModel(User) // Внедрение модели пользователя, используемая для CRUD операций с пользователями.
                private userRepository: typeof User, // Обьявляем ф-ию ссылкой на табл user
                private roleService: RolesService) {} // Ссылка на табл ролей сервис
/*
this.userRepository – это внедренный экземпляр модели User из базы данных, который предоставляет методы для работы с данными пользователей.
Метод create принимает dto как аргумент, что означает, что данные, содержащиеся в dto, будут использованы для создания нового экземпляра модели User в базе данных.
*/




    async createUser(dto: CreateUserDto) {
        try {
            // Создание пользователя на основе переданных данных DTO
            const user = await this.userRepository.create(dto);

            // Получение роли "ADMIN" из базы данных
            const role = await this.roleService.getRoleByValue("ADMIN"); //Для исп роли надо ее создать сначала!!!
            if (!role) {
                throw new Error('Role not found'); // Обработка ошибки, если роль не найдена
            }

            // Устанавливаем связь между пользователем и его ролями
            await user.$set('roles', [role.id]);

            // Присваиваем роли пользователю для дальнейшего использования
            user.roles = [role];

            // Возвращаем созданного пользователя с его ролями
            return user;
        } catch (error) {
            // Здесь можно обработать ошибку, например, логировать её
            throw new Error(`Error creating user: ${error.message}`);
        }
    }


    async getAllUsers() {
        const users = await this.userRepository.findAll({include: {all: true}});//Заьираем все что связ с табл польз!!!
        return users;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({where: {email}, include: {all: true}})//Вывести все где сошелся имейл
        return user;
    }

    async addRole(dto: AddRoleDto) {
        const user = await this.userRepository.findByPk(dto.userId);
        const role = await this.roleService.getRoleByValue(dto.value);
        if (role && user) {
            await user.$add('role', role.id);// Устанавливаем связь роли с пользователем.
            return dto;// Возвращаем DTO с информацией о роли.
        }
        throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
    }


    async ban(dto: BanUserDto) {

            const user = await this.userRepository.findByPk(dto.userId);
            user.banned = true;
            user.banReason = dto.banReason;
            const savedUser = await user.save(); // Сохраняем изменения в базе данных.
            return savedUser; // Возвращаем объект пользователя с обновленной информацией.

    }

}
