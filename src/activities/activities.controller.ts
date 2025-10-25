import { Controller, Get, Post, Param, Body, BadRequestException, Put, Delete } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import * as path from 'path';
import { UpdateActivityDto } from './dtos/update-activity.dto';

@Controller('activities')
export class ActivitiesController {
    constructor(
        private readonly activitiesService: ActivitiesService,
        private readonly cloudinaryService: CloudinaryService
    ) {}

    @Get()
    findAll() {
        return this.activitiesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.activitiesService.findOne(id);
    }

    @Post()
    create(@Body() data: any) {

        if (!data.imageUrl) {
            throw new BadRequestException("'imageUrl' is required");
        }

        return this.activitiesService.create(data);
    }

    @Post('seeder')
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
    async update(@Param('id') id: string, @Body() body: UpdateActivityDto) {
        if (!id) throw new BadRequestException('You must provide a valid ID');
        return this.activitiesService.updateActivity(id, body);
    }
    
    @Delete(':id')
    async delete(@Param('id') id: string) {
        if (!id) throw new BadRequestException('You must provide a valid ID');
        return this.activitiesService.deleteActivity(id);
    }
}