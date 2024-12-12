import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import { UsersModule } from './users/users.module';
import {ConfigModule} from "@nestjs/config";
import {User} from "./users/users.model";
import { RolesModule } from './roles/roles.module';
import {Role} from "./roles/roles.model";
import {UserRoles} from "./roles/user-roles.model";
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import {Post} from "./posts/posts.model";
import { FilesModule } from './files/files.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import * as path from 'path';

//Обьявляем модуль
@Module({
    //Обьявл пустой массив контроллеров
    controllers: [],
    //Empty massiv провайдеров
    providers: [],
    //Импортируем модули
    imports: [
        //for root - метод настраивает корневую конфигурацию модуля для приложения
        ConfigModule.forRoot({
           envFilePath: `.${process.env.NODE_ENV}.env`//Настройки оэнвов
        }),
        // Настройка модуля для обслуживания статических файлов
        ServeStaticModule.forRoot({
            rootPath: path.resolve( __dirname, 'static'),// Указывает директорию, из которой будут обслуживаться статические файлы
        }),
        //Настройка squelize для всех польз
        SequelizeModule.forRoot({
            dialect: 'postgres', //Выбрал диалект базы данных
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRESS_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRESS_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [User, Role, UserRoles, Post], //Загружаю модели бд.
            autoLoadModels: true // Автоматическая загрузка моделей
        }),
        //Импортируем модели для бд
        UsersModule,
        RolesModule,
        AuthModule,
        PostsModule,
        FilesModule,
    ]
})
export class AppModule {}
