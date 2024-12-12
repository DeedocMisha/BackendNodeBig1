import {BelongsToMany, Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Role} from "../roles/roles.model";
import {UserRoles} from "../roles/user-roles.model";
import {Post} from "../posts/posts.model";

interface UserCreationAttrs {// Этот интерфейс определяет атрибуты, необходимые для создания нового пользователя. В данном случае это email и password. Это помогает TypeScript понять, какие данные должны быть переданы при создании нового экземпляра модели User.
    email: string;
    password: string;
}

@Table({tableName: 'users'}) //Создание таьлицы
export class User extends Model<User, UserCreationAttrs>/*Прокидывем модель орм для табл*/ {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})//Свагер
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})//Строка табл в бд!
    id: number;

    @ApiProperty({example: 'user@mail.ru', description: 'Почтовый адрес'})//Свагер
    @Column({type: DataType.STRING, unique: true, allowNull: false})//Строка табл в бд!
    email: string;

    @ApiProperty({example: '12345678', description: 'Пароль'})//Свагер
    @Column({type: DataType.STRING, allowNull: false})//Строка табл в бд!
    password: string;

    @ApiProperty({example: 'true', description: 'Забанен или нет'})//Свагер
    @Column({type: DataType.BOOLEAN, defaultValue: false})//Строка табл в бд!
    banned: boolean;

    @ApiProperty({example: 'За хулиганство', description: 'Причина блокировки'})//Свагер
    @Column({type: DataType.STRING, allowNull: true})//Строка табл в бд!
    banReason: string;

    @BelongsToMany(() => Role, () => UserRoles) //Связь М:М между польз и 2 табл
    roles: Role[];

    @HasMany(() => Post)//существует связь один-ко-многим между сущностью User и сущностью Post
    posts: Post[];
}
