import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";


//НАСТРОЙКИ МАРШРУТИЗАЦИИ ДЛЯ РАЗН ПОЛЬЗОВАТЕЛЕЙ!!!


// Декоратор Injectable позволяет использовать данный класс в DI (Dependency Injection).
@Injectable()
export class JwtAuthGuard implements CanActivate {
    // Конструктор принимает JwtService, который будет использоваться для проверки токенов.
    constructor(private jwtService: JwtService) { }// Можно внутри класса исп.

    // Метод canActivate определяет, может ли пользователь получить доступ к защищенному ресурсу.
    //context — это объект типа ExecutionContext, который предоставляет информацию о текущем контексте выполнения. Он включает в себя детали о запросе, ответе и других аспектах текущей обработки запроса.
    /*Метод может возвращать одно из следующих значений:

boolean: Если возвращается true, это означает, что доступ к защищенному ресурсу разрешен. Если false, доступ будет запрещен.

Promise: Метод может возвращать промис, который в конечном итоге разрешается в значение true или false.

Observable: Метод также может возвращать Observable, который emits значение true или false.*/
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        // Получаем объект запроса из контекста выполнения.
        const req = context.switchToHttp().getRequest();//Вытаск путь домена
        try {
            // Извлекаем заголовок авторизации из запроса.
            const authHeader = req.headers.authorization; //Ишем authorization

            /*Метод split(' ') разбивает строку authHeader на массив подстрок по пробелу. Поскольку стандартный \
            заголовок авторизации с токеном предполагает, что первая часть всегда будет Bearer,
            а вторая часть — сам токен, метод split вернет массив из двух строк: ['Bearer', '<токен>'].*/
            const bearer = authHeader.split(' ')[0];
            const token = authHeader.split(' ')[1];

            // Проверяем, что заголовок начинается с "Bearer" и что токен присутствует.
            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({ message: 'Пользователь не авторизован' });//Вывод что польз не найден
            }

            // Проверяем токен с помощью JwtService.
            const user = this.jwtService.verify(token);

            // Строка кода req.user = user; используется для того, чтобы сохранить информацию о пользователе, полученную из JWT (JSON Web Token), в объекте запроса (req). Это позволяет другим обработчикам маршрутов и промежуточным слоям в приложении NestJS получать доступ к данным о текущем пользователе.
            req.user = user;

            // Возвращаем true, что позволяет доступ к защищенному ресурсу.
            return true;
        } catch (e) {
            // В случае ошибки (например, если токен недействителен), выбрасываем исключение UnauthorizedException.
            throw new UnauthorizedException({ message: 'Пользователь не авторизован' });
        }
    }
}