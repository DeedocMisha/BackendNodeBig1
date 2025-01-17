import { forwardRef, Module } from '@nestjs/common'; // Импорт необходимых декораторов и классов из NestJS
import { UsersController } from './users.controller'; // Импорт контроллера пользователей, который реализует API для пользователей
import { UsersService } from './users.service'; // Импорт сервиса пользователей, который содержит бизнес-логику работы с пользователями
import { SequelizeModule } from '@nestjs/sequelize'; // Импорт модуля Sequelize для работы с базой данных
import { User } from './users.model'; // Импорт модели пользователя, которая описывает структуру данных пользователей
import { Role } from '../roles/roles.model'; // Импорт модели роли, связанной с пользователями
import { UserRoles } from '../roles/user-roles.model'; // Импорт модели связывающей роли и пользователей
import { RolesModule } from '../roles/roles.module'; // Импорт модуля ролей для управления ролями пользователей
import { AuthModule } from '../auth/auth.module'; // Импорт модуля аутентификации
import { Post } from '../posts/posts.model'; // Импорт модели поста, связанной с пользователями

@Module({ // Декоратор, который определяет модуль
    controllers: [UsersController], // Указание контроллера, который будет использоваться в этом модуле
    providers: [UsersService], // Указание провайдеров (сервисов), которые будут использоваться в этом модуле
    imports: [ // Импортируемые модули для использования их функциональности в этом модуле
        SequelizeModule.forFeature([User, Role, UserRoles, Post]), // Регистрация моделей для работы с базой данных. Это позволяет использовать ORM Sequelize для выполнения операций с этими моделями.
        RolesModule, // Импорт модуля ролей для использования его функциональности
        forwardRef(() => AuthModule), //  Использование функции forwardRef позволяет избежать циклических зависимостей между модулями, когда модуль пользователей и модуль аутентификации ссылаются друг на друга.
    ],
    exports: [ // Экспортируемые элементы, которые могут быть доступны в других модулях
        UsersService, // Экспорт сервиса пользователей для использования в других модулях
    ],
})
export class UsersModule {} // Экспорт самого модуля пользователе