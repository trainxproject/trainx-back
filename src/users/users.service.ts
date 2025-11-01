import { BadRequestException, ForbiddenException, Get, Injectable, NotFoundException, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Trainer } from '../trainers/entities/trainer.entity';
import { Plan } from 'src/plans/plan.entity';
import { Pay } from 'src/payments/entities/payment.entity';

@Injectable()
export class UsersService {
    
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private readonly cloudinaryService: CloudinaryService,
        @InjectRepository(Trainer)
        private trainersRepository: Repository<Trainer>,
        @InjectRepository(Plan)
        private planRepository: Repository<Plan>,
        @InjectRepository(Pay)
        private subscriptionRepository: Repository<Pay>

    ) {}

    async findAll(): Promise<User[]> {
        return this.usersRepository.find({relations: ["subscription"]});
    }

    async findOne(id: string) {
        return this.usersRepository.findOne({ where: { id } });
    }

    async findUserTrainer(id: string) {
        return this.usersRepository.findOne({
            where: { id },
            relations: ['trainer'],
        });
    }

    async planUserService(userId: any) {

        const user = await this.usersRepository.findOne({
            where: {id: userId}
        })

        if(!user) throw new NotFoundException("User not Found")
        
        const planSub = await this.subscriptionRepository.findOne({
            where: {user: {id: user.id}},
            relations: ["user", "plan"]
        })
        
        if(!planSub) throw new NotFoundException("Plan not found")
        if(planSub.paid === false) throw new ForbiddenException("Purchase a Plan to access all the benefits.")

        return planSub.plan
    }

    async create(user: Partial<User>) {
        const newUser = this.usersRepository.create(user);
        return this.usersRepository.save(newUser);
    }

    async remove(id: string) {
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

    async assignTrainer(userId: string, trainerId: string) {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: ['trainer'],
        });
        if (!user) throw new NotFoundException('Usuario no encontrado');
    
        if (!user.hasPaid) {
            throw new BadRequestException('El usuario aún no ha pagado su suscripción');
        }
    
        const trainer = await this.trainersRepository.findOne({ where: { id: trainerId } });
        if (!trainer) throw new NotFoundException('Entrenador no encontrado');
    
        if (!trainer.available) {
            throw new BadRequestException('El entrenador no está disponible');
        }
    
        user.trainer = trainer;
        await this.usersRepository.save(user);
    
        return {
            message: `Entrenador ${trainer.name} asignado exitosamente al usuario ${user.name}`,
        };
    }

    async updateName(id: string, newName: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        user.name = newName;
        return this.usersRepository.save(user);
    }

    async findAllComplete(): Promise<User[]> {
        return this.usersRepository.find({
            relations: [
                'subscription',
                'payments',
                'payments.plan',
                'trainer',
                'reservations',
                'reservations.schedule',
                'reservations.schedule.activity'
            ],
            order: {
                name: 'ASC',
                payments: {
                createdAt: 'DESC'
                }
            }
        });
    }
}