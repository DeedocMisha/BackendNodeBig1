import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as path from 'path'
import * as fs from 'fs';
import * as uuid from 'uuid';

@Injectable()//Делаем доступным для иньекций
export class FilesService {

    async createFile(file): Promise<string>/*Возвращает промис string*/ {
        try {
            const fileName = uuid.v4() + '.jpg';//Случ имя
            const filePath = path.resolve(__dirname, '..', 'static')
            if (!fs.existsSync(filePath)) { //Проверяем на существование папку для сохр ф-в
                fs.mkdirSync(filePath, {recursive: true})//Созд папку если нет пути друш в дружке
            }
            fs.writeFileSync(path.join(filePath, fileName), file.buffer)//Обьединяем путь и имя ф-ла и запис буфер файла
            return fileName;//Возвращаем имя файла, которое мы только что создали
        } catch (e) {
            throw new HttpException('Произошла ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}
