import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { Schedule } from '../schedules/entities/schedule.entity';
import { Subscription } from '../suscriptions/entities/subscription.entity';

@Injectable()
export class ReservationsService {
    constructor(
        @InjectRepository(Reservation)
        private reservationRepository: Repository<Reservation>,
        @InjectRepository(Schedule)
        private scheduleRepository: Repository<Schedule>,
        @InjectRepository(Subscription)
        private subscriptionRepository: Repository<Subscription>,
    ) {}

    async createReservation(userId: string, scheduleId: string) {
        const schedule = await this.scheduleRepository.findOne({
        where: { id: scheduleId },
        relations: ['activity', 'reservations'],
        });
        if (!schedule) throw new BadRequestException('Schedule not found');

        if (!schedule.activity.requiresReservation)
        throw new BadRequestException('This activity does not require a reservation');

        const activeSub = await this.subscriptionRepository.findOne({
        where: { user: { id: userId }, isActive: true },
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
        const reservation = await this.reservationRepository.findOne({
            where: { id: reservationId },
            relations: ['user', 'schedule', 'schedule.activity'],
        });

        if (!reservation) throw new NotFoundException('Reservation not found');

        // Solo el dueño de la reserva (userId) puede cancelarla con este endpoint
        if (!reservation.user || reservation.user.id !== userId) {
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
}