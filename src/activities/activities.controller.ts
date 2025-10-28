import { Controller, Get, Post, Param, Body, BadRequestException, Put, Delete } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import * as path from 'path';
import { UpdateActivityDto } from './dtos/update-activity.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Activities')
@Controller('activities')
export class ActivitiesController {
    constructor(
        private readonly activitiesService: ActivitiesService,
        private readonly cloudinaryService: CloudinaryService
    ) {}

    @Get()
    @ApiOperation({ summary: 'Get all activities' })
    @ApiResponse({ status: 200, description: 'List of activities retrieved successfully' })
    findAll() {
        return this.activitiesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an activity by ID' })
    @ApiParam({ name: 'id', description: 'Activity ID' })
    @ApiResponse({ status: 200, description: 'Activity found successfully' })
    @ApiResponse({ status: 404, description: 'Activity not found' })
    findOne(@Param('id') id: string) {
        return this.activitiesService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new activity' })
    @ApiBody({ 
        description: 'Data to create activity',
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                requiresReservation: { type: 'boolean' },
                maxCapacity: { type: 'number', nullable: true },
                imageUrl: { type: 'string' }
            },
            required: ['imageUrl']
        }
    })
    @ApiResponse({ status: 201, description: 'Activity created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    create(@Body() data: any) {

        if (!data.imageUrl) {
            throw new BadRequestException("'imageUrl' is required");
        }

        return this.activitiesService.create(data);
    }

    @Post('seeder')
    @ApiOperation({ summary: 'Seed database with sample activities' })
    @ApiResponse({ status: 201, description: 'Activities seeded successfully' })
    async seed() {
        const activities = [
            {
                name: 'CrossFit',
                description: 'High intensity functional training.',
                requiresReservation: true,
                maxCapacity: 10,
                imageUrl: 'https://res.cloudinary.com/dxpqhpme3/image/upload/v1760749983/crossfit_ufv3qq.jpg',
            },
            {
                name: 'Pilates',
                description: 'Strengthens the body and improves flexibility.',
                requiresReservation: true,
                maxCapacity: 10,
                imageUrl: 'https://res.cloudinary.com/dxpqhpme3/image/upload/v1760749983/pilates_npcmil.jpg',
            },
            {
                name: 'Zumba',
                description: 'Fun dance and cardio class.',
                requiresReservation: true,
                maxCapacity: 10,
                imageUrl: 'https://res.cloudinary.com/dxpqhpme3/image/upload/v1760749983/zumba_lrfnws.jpg',
            },
            {
                name: 'Gym',
                description: 'Free access to the gym to train at any time within the authorized hours.',
                requiresReservation: false,
                maxCapacity: null,
                imageUrl: 'https://res.cloudinary.com/dxpqhpme3/image/upload/v1760749983/gym_qr4n4h.jpg',
            }
        ];

    for (const activity of activities) {
        const exists = await this.activitiesService.findByName(activity.name);
        if (!exists) {
            await this.activitiesService.create(activity);
        }
    }

        return { message: 'Activities seeded successfully ✅' };
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update an existing activity' })
    @ApiParam({ name: 'id', description: 'Activity ID to update' })
    @ApiBody({ type: UpdateActivityDto })
    @ApiResponse({ status: 200, description: 'Activity updated successfully' })
    @ApiResponse({ status: 400, description: 'Invalid ID or input data' })
    @ApiResponse({ status: 404, description: 'Activity not found' })
    async update(@Param('id') id: string, @Body() body: UpdateActivityDto) {
        if (!id) throw new BadRequestException('Valid ID must be provided');
        return this.activitiesService.updateActivity(id, body);
    }
    
    @Delete(':id')
    @ApiOperation({ summary: 'Delete an activity' })
    @ApiParam({ name: 'id', description: 'Activity ID to delete' })
    @ApiResponse({ status: 200, description: 'Activity deleted successfully' })
    @ApiResponse({ status: 400, description: 'Invalid ID' })
    @ApiResponse({ status: 404, description: 'Activity not found' })
    async delete(@Param('id') id: string) {
        if (!id) throw new BadRequestException('Valid ID must be provided');
        return this.activitiesService.deleteActivity(id);
    }
}