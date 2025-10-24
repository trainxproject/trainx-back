import { Controller, Post, Body, Delete, Param, BadRequestException } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CancelReservationDto } from "./dtos/cancel-reservation.dto"

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

    @Delete(':id')
    async cancelReservation(
        @Param('id') id: string,
        @Body() body: CancelReservationDto,
    ) {
        const { userId } = body;
        if (!userId) throw new BadRequestException('UserId is required in the body to authorize cancellation');
        return this.reservationsService.cancelReservation(id, userId);
    }
}