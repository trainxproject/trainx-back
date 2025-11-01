import { Controller, Post, Body, Delete, Param, BadRequestException, Get, Req, ParseUUIDPipe, UseGuards, Patch } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CancelReservationDto } from "./dtos/cancel-reservation.dto"
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/admin.guard';

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

    @UseGuards(JwtAuthGuard)
    @Post(":id")
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
        @Param("id", new ParseUUIDPipe()) scheduleId: string ,
        @Req() req: any
    ) {
        const userId = req.user.id
        return this.reservationsService.createReservation(userId, scheduleId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    @ApiOperation({ summary: 'Cancel a reservation' })
    @ApiParam({ name: 'id', description: 'Reservation ID' })
    @ApiBody({ type: CancelReservationDto })
    @ApiResponse({ status: 200, description: 'Reservation cancelled successfully' })
    @ApiResponse({ status: 400, description: 'User ID is required' })
    @ApiResponse({ status: 404, description: 'Reservation not found' })
    @ApiResponse({ status: 403, description: 'User not authorized to cancel this reservation' })
    async cancelReservation(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Req() req: any
    ) {
        const userId = req.user.id
        return this.reservationsService.cancelReservation(id, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    async deleteReservation(
        @Param("id", new ParseUUIDPipe())  id: string,
        @Req() req: any
    ){
        const userId = req.user.id
        await this.reservationsService.deleteReservation(id, userId);
        return {message: "Reservation deleted successfully"}
    }

}