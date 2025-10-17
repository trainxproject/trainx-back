import { Controller, Get, Post, Param, Body, BadRequestException } from '@nestjs/common';
import { ActivitiesService } from './activities.service';

@Controller('activities')
export class ActivitiesController {
    constructor(private readonly activitiesService: ActivitiesService) {}

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
}