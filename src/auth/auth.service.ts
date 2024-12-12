import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {CreateUserDto} from "../users/dto/create-user.dto";
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import {User} from "../users/users.model";

@Injectable()
export class AuthService {

    constructor(private userService: UsersService, //Импортируем ф-ии из юзерсервис
                private jwtService: JwtService) {} //импортируем jwt

    async login(userDto: CreateUserDto) {
        const user = await this.validateUser(userDto)
        return this.generateToken(user)//Ф-я генерации токена для авториз пользователя
    }

    private async validateUser(userDto: CreateUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email);
        const passwordEquals = await bcrypt.compare(userDto.password, user.password); //Сравнивает пароли
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({message: 'Некорректный емайл или пароль'})
    }
    private async generateToken(user: User) {
        const payload = {email: user.email, id: user.id, roles: user.roles} //Импортир все данные пользователя
        return {
            token: this.jwtService.sign(payload)//Генерим токен ко всем данным пользователя
        }
    }

    async registration(userDto: CreateUserDto) {
        const candidate = await this.userService.getUserByEmail(userDto.email);
        if (candidate) {
            throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5);//Хэшируем пароль если польз нет
        const user = await this.userService.createUser({...userDto, password: hashPassword}) //Сощл польз с хэш паролем и ланными из userdto на 3 каталога назад
        return this.generateToken(user)//Возвращается токен польз с его всеми данными!!!
    }
}
