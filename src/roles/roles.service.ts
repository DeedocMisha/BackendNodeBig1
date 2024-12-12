import { Injectable } from '@nestjs/common';
import {CreateRoleDto} from "./dto/create-role.dto";
import {InjectModel} from "@nestjs/sequelize";
import {Role} from "./roles.model";

@Injectable() //может быть внедрен в другие классы.
export class RolesService {

    constructor(@InjectModel(Role) private roleRepository: typeof Role) {}// Внедряем модель Role через InjectModel, которая будет использоваться для работы с базой данных.

    async createRole(dto: CreateRoleDto) {
        const role = await this.roleRepository.create(dto);// Используем репозиторий для создания новою роли в базе данных, передавая данные из DTO.
        return role;
    }

    async getRoleByValue(value: string) {
        const role = await this.roleRepository.findOne({where: {value}})// Используем метод findOne для поиска роли по значению. Где значение совпадает с полем value в базе
        return role;
    }

}
