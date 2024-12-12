import { Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "../users/users.model";
import {Role} from "./roles.model";
//Для табл user_roles!!!!!
//Модели являются представлением данных, которые отражают структуру таблиц или документов в базе данных. Они описывают, как данные хранятся и организованы в базе данных.
@Table({tableName: 'user_roles', createdAt: false, updatedAt: false})
export class UserRoles extends Model<UserRoles> { // наследуете класс Model, вы получаете доступ ко всем методам и свойствам, которые предоставляет этот базовый класс.

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Role)
    @Column({type: DataType.INTEGER})
    roleId: number;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;

}
