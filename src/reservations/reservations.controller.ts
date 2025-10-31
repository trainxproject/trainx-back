import { Controller, Post, Body, Delete, Param, BadRequestException, Get } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CancelReservationDto } from "./dtos/cancel-reservation.dto"
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) {}

    @Get()
    @ApiOperation({ summary: 'Get all reservations' })
    @ApiResponse({ status: 200, description: 'List of reservations retrieved successfully' })
    findAllReservations() {
        return this.reservationsService.findAllReservations();
    }

    @Get("user/:id")
    @ApiOperation({ summary: 'Get user reservations' })
    findUserReservations(@Param('userId') userId: string) {
        return this.reservationsService.findUserReservations(userId);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new reservation' })
    @ApiBody({ 
        description: 'Reservation data',
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'string', description: 'User ID' },
                scheduleId: { type: 'string', description: 'Schedule ID' }
            },
            required: ['userId', 'scheduleId']
        }
    })
    @ApiResponse({ status: 201, description: 'Reservation created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 404, description: 'User or schedule not found' })
    @ApiResponse({ status: 409, description: 'Reservation already exists or schedule is full' })
    async createReservation(
        @Body() body: { userId: string; scheduleId: string },
    ) {
        const { userId, scheduleId } = body;
        return this.reservationsService.createReservation(userId, scheduleId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Cancel a reservation' })
    @ApiParam({ name: 'id', description: 'Reservation ID' })
    @ApiBody({ type: CancelReservationDto })
    @ApiResponse({ status: 200, description: 'Reservation cancelled successfully' })
    @ApiResponse({ status: 400, description: 'User ID is required' })
    @ApiResponse({ status: 404, description: 'Reservation not found' })
    @ApiResponse({ status: 403, description: 'User not authorized to cancel this reservation' })
    async cancelReservation(
        @Param('id') id: string,
        @Body() body: CancelReservationDto,
    ) {
        const { userId } = body;
        if (!userId) throw new BadRequestException('UserId is required in the body to authorize cancellation');
        return this.reservationsService.cancelReservation(id, userId);
    }
}