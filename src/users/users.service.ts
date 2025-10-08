import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private readonly cloudinaryService: CloudinaryService
    ) {}

    findAll() {
        return this.usersRepository.find();
    }

    findOne(id: string) {
        return this.usersRepository.findOne({ where: { id } });
    }

    create(user: Partial<User>) {
        const newUser = this.usersRepository.create(user);
        return this.usersRepository.save(newUser);
    }

    remove(id: string) {
        return this.usersRepository.delete(id);
    }

    async findByEmail(email: string) {
        return this.usersRepository.findOne({ where: { email } });
    }

    async uploadProfilePicture(id: string, imageUrl: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) throw new Error('Usuario no encontrado');
    
        user.profilePicture = imageUrl;
    
        return this.usersRepository.save(user);
    }

    async saveStatus(user: User): Promise<User> {
        return this.usersRepository.save(user);
    }
}