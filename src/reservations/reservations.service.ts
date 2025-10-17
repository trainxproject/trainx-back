import { Injectable, BadRequestException } from '@nestjs/common';
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
        if (!schedule) throw new BadRequestException('Horario no encontrado');

        if (!schedule.activity.requiresReservation)
        throw new BadRequestException('Esta actividad no requiere reserva');

        const activeSub = await this.subscriptionRepository.findOne({
        where: { user: { id: userId }, isActive: true },
        });
        if (!activeSub) throw new BadRequestException('No tiene una suscripción activa');

        const currentReservations = schedule.reservations.length;
        if (
        schedule.activity.maxCapacity &&
        currentReservations >= schedule.activity.maxCapacity
        ) {
        throw new BadRequestException('Cupo completo');
        }

        const reservation = this.reservationRepository.create({
        user: { id: userId },
        schedule,
        status: 'active',
        });

        return this.reservationRepository.save(reservation);
    }
}