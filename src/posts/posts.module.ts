import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../users/users.model";
import {Post} from "./posts.model";
import {FilesModule} from "../files/files.module";

@Module({
  providers: [PostsService], //Подкл пров-в
  controllers: [PostsController],//Подко контр-в
  imports: [
    SequelizeModule.forFeature([User, Post]), // Импортируем SequelizeModule для работы с моделями User и Post, чтобы иметь возможность использовать их в этом модуле.
      FilesModule //Для работы с ф-ми
  ]
})
export class PostsModule {}
