import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { SchedulesService } from './schedules.service';

@Controller('schedules')
export class SchedulesController {
    constructor(private readonly schedulesService: SchedulesService) {}

    @Get()
    findAll() {
        return this.schedulesService.findAll();
    }

    @Get('activity/:id')
    findByActivity(@Param('id') id: string) {
        return this.schedulesService.findByActivity(id);
    }

    @Post()
    create(@Body() data: any) {
        return this.schedulesService.create(data);
    }
}