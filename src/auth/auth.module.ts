import { forwardRef, Module } from '@nestjs/common'; // Импортируем необходимые функции и классы из NestJS
import { AuthController } from './auth.controller'; // Импортируем контроллер аутентификации
import { AuthService } from './auth.service'; // Импортируем сервис аутентификации
import { UsersModule } from "../users/users.module"; // Импортируем модуль пользователей
import { JwtModule } from "@nestjs/jwt"; // Импортируем модуль JWT для работы с JSON Web Tokens

@Module({
    controllers: [AuthController], // Указываем контроллер аутентификации
    providers: [AuthService], // Указываем сервис аутентификации
    imports: [
        forwardRef(() => UsersModule), // Используем forwardRef для избежания циклических зависимостей с UsersModule
        JwtModule.register({
            secret: process.env.PRIVATE_KEY || 'SECRET', // Указываем секретный ключ для подписи токенов
            signOptions: {
                expiresIn: '24h' // Указываем время действия токена (24 часа)
            }
        })
    ],
    exports: [
        AuthService, // Экспортируем AuthService, чтобы он был доступен в других модулях
        JwtModule // Экспортируем JwtModule для использования в других модулях
    ]
})
export class AuthModule {} // Объявляем класс AuthModule как модуль