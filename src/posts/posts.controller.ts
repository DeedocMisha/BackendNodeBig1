import {Body, Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {CreatePostDto} from "./dto/create-post.dto";
import {PostsService} from "./posts.service";
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('posts') //Путь пост в домене
export class PostsController {

    constructor(private postService: PostsService) {}

    @Post() //Пост запрос
    @UseInterceptors(FileInterceptor('image')) // Декоратор, который применяет FileInterceptor для обработки загружаемого файла с полем 'image'
    createPost(@Body() dto: CreatePostDto,
               @UploadedFile() image) {// Декоратор @UploadedFile извлекает файл, загруженный с помощью FileInterceptor
        return this.postService.create(dto, image) //Передаем в постсервис изображение и ДТО
    }
}
