import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "../users/users.model";

interface PostCreationAttrs { //Данные, кот вводятся
    title: string;
    content: string;
    userId: number;
    image: string; //Т.к путь
}

@Table({tableName: 'posts'})
export class Post extends Model<Post, PostCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    title: string;

    @Column({type: DataType.STRING, allowNull: false})
    content: string;

    @Column({type: DataType.STRING})
    image: string;

    @ForeignKey(() => User) //ПК к табл юзер
    @Column({type: DataType.INTEGER})
    userId: number;

    @BelongsTo(() => User)  //1:M
    author: User

}
