import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation } from './entities/reservation.entity';
import { Schedule } from '../schedules/entities/schedule.entity';
import { Subscription } from '../suscriptions/entities/subscription.entity';
import { SchedulesModule } from '../schedules/schedules.module';
import { SubscriptionsModule } from '../suscriptions/subscriptions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Schedule, Subscription]),
    SchedulesModule, 
    SubscriptionsModule, 
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}