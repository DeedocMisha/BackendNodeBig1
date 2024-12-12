import {
    CanActivate,                // Интерфейс для создания защитников маршрутов (guards)
    ExecutionContext,          // Контекст выполнения (используется для получения информации о текущем запросе)
    HttpException,             // Класс, представляющий HTTP-исключения
    HttpStatus,                // Перечисление с возможными статусами HTTP
    Injectable,                // Декоратор, обозначающий класс как сервис для внедрения зависимостей
    UnauthorizedException      // Исключение, выбрасываемое при отсутствии авторизации
} from "@nestjs/common";

import {Observable} from "rxjs";  // Импорт класса Observable для работы с асинхронными потоками данных
import {JwtService} from "@nestjs/jwt";  // Импорт сервиса для работы с JWT
import {Reflector} from "@nestjs/core";    // Импорт класса Reflector для доступа к метаданным
import {ROLES_KEY} from "./roles-auth.decorator";  // Импорт константы, представляющей ключ для ролей

@Injectable()
export class RolesGuard implements CanActivate {  // Класс защиты ролей, реализующий интерфейс CanActivate
    constructor(private jwtService: JwtService,  // Внедрение зависимостей JwtService
                private reflector: Reflector) { // Внедрение зависимостей Reflector
    }

    // Метод canActivate отвечает за проверку доступа к маршруту из  @nestjs/common
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            // Получение всех ролей, необходимых для доступа к текущему обработчику
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                /*
                Первый аргумент (ROLES_KEY) — это ключ, который используется для получения метаданных. Этот ключ должен точно соответствовать
                 тому, что передавалось декоратору (например, в декораторе Roles).

                Второй аргумент — это массив, содержащий информацию о том, откуда необходимо получить метаданные. В данном случае мы передаем
                массив, содержащий два элемента:

                context.getHandler(): Это метод, который возвращает текущий обработчик (метод) запроса. Это позволяет получить метаданные,
                установленные для конкретного метода контроллера.

                context.getClass(): Этот метод возвращает класс контроллера, в котором определён этот обработчик. Это позволяет получить
                метаданные, установленные на уровне всего контроллера (при использовании декоратора на уровне класса).

                */
                context.getHandler(),            // Получение текущего обработчика
                context.getClass(),              // Получение текущего класса
            ]);

            // Если требуемых ролей нет, доступ разрешен
            if (!requiredRoles) {
                return true;  // Не проверяем доступ, если роли не определены
            }

            // Получение объекта запроса из контекста
            const req = context.switchToHttp().getRequest();
            // Извлечение заголовка Authorization
            const authHeader = req.headers.authorization;
            // Разделение заголовка на тип и токен
            const bearer = authHeader.split(' ')[0];
            const token = authHeader.split(' ')[1];

            // Проверка формата токена
            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({message: 'Пользователь не авторизован'});
                // Если заголовок неправилен, выбрасываем исключение
            }

            // Верификация токена JWT и получение информации о пользователе
            const user = this.jwtService.verify(token);
            req.user = user;  // Сохранение информации о пользователе в запросе

            // Проверка, имеет ли пользователь необходимые роли для доступа
            return user.roles.some(role => requiredRoles.includes(role.value));
        } catch (e) {
            console.log(e);  // Логирование ошибки
            throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
            // Если произошла ошибка, выбрасываем исключение с помощью HttpException
        }
    }
}