import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { Schedule } from '../schedules/entities/schedule.entity';
import { Subscription } from '../suscriptions/entities/subscription.entity';
import { User } from 'src/users/entities/user.entity';
import { Pay } from 'src/payments/entities/payment.entity';

@Injectable()
export class ReservationsService {
    
    constructor(
        @InjectRepository(Reservation)
        private reservationRepository: Repository<Reservation>,
        @InjectRepository(Schedule)
        private scheduleRepository: Repository<Schedule>,
        @InjectRepository(Pay)
        private subscriptionRepository: Repository<Pay>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async findAllReservations() {
        const response = await this.reservationRepository.find({ relations: ['user', 'schedule', 'schedule.activity'] });

        return response.map((e)=> ({
            id: e?.id,
            userId: e.user.id,
            name: e.user.name,
            email: e.user.email,
            schedule: e.schedule,
            activity: e.schedule.activity
        }))  
    }

    async findUserReservations(userId: string) {
        return this.reservationRepository.find({
            where: { user: { id: userId } },
            relations: ['user', 'schedule'],
        })
    }

    async createReservation(userId: string, scheduleId: string) {

        const user = await this.userRepository.findOne({
            where: {id: userId}
        })

        const schedule = await this.scheduleRepository.findOne({
        where: { id: scheduleId },
        relations: ['activity', 'reservations'],
        });
        if (!schedule) throw new BadRequestException('Schedule not found');

        if (!schedule.activity.requiresReservation)
        throw new BadRequestException('This activity does not require a reservation');

        const activeSub = await this.subscriptionRepository.findOne({
        where: { user: { id: user?.id }, paid: true },
        });
        if (!activeSub) throw new BadRequestException('You do not have an active subscription');

        const currentReservations = schedule.reservations.length;
        if (
        schedule.activity.maxCapacity &&
        currentReservations >= schedule.activity.maxCapacity
        ) {
        throw new BadRequestException('Full capacity');
        }

        const reservation = this.reservationRepository.create({
        user: { id: userId },
        schedule,
        status: 'active',
        });

        return this.reservationRepository.save(reservation);
    }

    async cancelReservation(reservationId: string, userId: string) {

        const user = await this.userRepository.findOne({
            where: {id: userId}
        })


        const reservation = await this.reservationRepository.findOne({
            where: { id: reservationId, user: {id: user?.id}},
            relations: ['user', 'schedule', 'schedule.activity'],
        });

        if (!reservation) throw new NotFoundException('Reservation not found');

        // Solo el dueño de la reserva (userId) puede cancelarla con este endpoint
        if (!reservation.user || reservation.user.id !== user?.id) {
            throw new ForbiddenException('Not authorized to cancel this reservation');
        }

        // Si ya está cancelada o completada, no permitimos cancelarla nuevamente
        if (reservation.status === 'cancelled') {
            throw new BadRequestException(`A reservation with status cannot be cancelled '${reservation.status}'`);
        }

        reservation.status = 'cancelled';
        await this.reservationRepository.save(reservation);

        return { message: 'Reservation successfully cancelled', reservation };
    }


    async deleteReservation(id: string, userId: any) {

         const user = await this.userRepository.findOne({
            where: {id: userId}
        })

         const reservation = await this.reservationRepository.findOne({
            where: { id: id, user: {id: user?.id}},
            relations: ['user'],
        });

        if(!reservation) throw new NotFoundException("Reservation not exist")

        if(reservation?.status === "active") throw new ForbiddenException("You cannot delete a reservation that you have not canceled")

        return await this.reservationRepository.remove(reservation)    
    }
}