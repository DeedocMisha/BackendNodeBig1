import {Module} from '@nestjs/common';
import {RolesService} from './roles.service';
import {RolesController} from './roles.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Role} from "./roles.model";
import {User} from "../users/users.model";
import {UserRoles} from "./user-roles.model";

@Module({
  providers: [RolesService],//Определяем провайдеры для модуля которые могут инъектироваться в другие компоненты
  controllers: [RolesController],//Контроллеры для обработки входящих HTTP-запросов
  imports: [
    SequelizeModule.forFeature([Role, User, UserRoles])
  ],
  exports: [
    RolesService // Экспортируем сервис, чтобы он был доступен в других модулях
  ]
})
export class RolesModule {} // Экспортируем класс модуля для его использования в других частях приложения
