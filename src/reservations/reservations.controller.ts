import { Controller, Post, Body } from '@nestjs/common';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) {}

    @Post()
    async createReservation(
        @Body() body: { userId: string; scheduleId: string },
    ) {
        const { userId, scheduleId } = body;
        return this.reservationsService.createReservation(userId, scheduleId);
    }
}