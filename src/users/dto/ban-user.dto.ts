export class BanUserDto { //Класс для бана пользователей
    readonly userId: number; //Юзерайди в этом файле можно обьявитть только 1 раз!
    readonly banReason: string;
}
