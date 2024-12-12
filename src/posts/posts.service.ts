import { Injectable } from '@nestjs/common';
import {CreatePostDto} from "./dto/create-post.dto";
import {InjectModel} from "@nestjs/sequelize";
import {Post} from "./posts.model";
import {FilesService} from "../files/files.service";

@Injectable()//Декоратор, который помечает класс как предоставляемый и доступный для внедрения зависимостей
export class PostsService {

    constructor(@InjectModel(Post)  //Вводим таблицу пост для дальн исп
                private postRepository: typeof Post, //Получение всей модели
                private fileService: FilesService) {}

    async create(dto: CreatePostDto, image: any) {
        const fileName = await this.fileService.createFile(image); //В createfile сидит создание названия и пути к ф-лу!!!
        const post = await this.postRepository.create({...dto, image: fileName}) //Обьед данные из дто и пути к ф-лу
        return post;
    }
}
