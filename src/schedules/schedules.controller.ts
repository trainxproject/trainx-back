import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { ActivitiesService } from '../activities/activities.service';

@ApiTags('Schedules')
@Controller('schedules')
export class SchedulesController {
    constructor(
        private readonly schedulesService: SchedulesService,
        private readonly activitiesService: ActivitiesService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Get all schedules' })
    @ApiResponse({ status: 200, description: 'List of schedules retrieved successfully' })
    findAll() {
        return this.schedulesService.findAll();
    }

    @Get('activity/:id')
    @ApiOperation({ summary: 'Get schedules by activity ID' })
    @ApiParam({ name: 'id', description: 'Activity ID' })
    @ApiResponse({ status: 200, description: 'Schedules found successfully' })
    @ApiResponse({ status: 404, description: 'Activity not found' })
    findByActivity(@Param('id') id: string) {
        return this.schedulesService.findByActivity(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new schedule' })
    @ApiBody({ 
        description: 'Data to create schedule',
        schema: {
            type: 'object',
            properties: {
                activityId: { type: 'string' },
                date: { type: 'string', format: 'date-time' },
                startTime: { type: 'string' },
                endTime: { type: 'string' },
                trainer: { type: 'string' }
            }
        }
    })
    @ApiResponse({ status: 201, description: 'Schedule created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    create(@Body() data: any) {
        return this.schedulesService.create(data);
    }

    @Post('seeder')
async seed() {

    const activities = await this.activitiesService.findAll();
    
    const crossfit = activities.find(a => a.name === 'CrossFit');
    const pilates = activities.find(a => a.name === 'Pilates');
    const zumba = activities.find(a => a.name === 'Zumba');
    const telas = activities.find(a => a.name === 'Telas');

    const schedules = [
        // CrossFit
        { dayOfWeek: 'Monday', startTime: '19:00', endTime: '20:00', trainer: 'Carlos López', activity: crossfit },
        { dayOfWeek: 'Wednesday', startTime: '19:00', endTime: '20:00', trainer: 'Carlos López', activity: crossfit },
        { dayOfWeek: 'Friday', startTime: '19:00', endTime: '20:00', trainer: 'Ana García', activity: crossfit },
        
        // Pilates
        { dayOfWeek: 'Tuesday', startTime: '18:00', endTime: '19:00', trainer: 'María Rodríguez', activity: pilates },
        { dayOfWeek: 'Thursday', startTime: '18:00', endTime: '19:00', trainer: 'María Rodríguez', activity: pilates },
        
        // Zumba
        { dayOfWeek: 'Monday', startTime: '20:00', endTime: '21:00', trainer: 'Fiama Martínez', activity: zumba },
        { dayOfWeek: 'Tuesday', startTime: '20:00', endTime: '21:00', trainer: 'Fiama Martínez', activity: zumba },
        { dayOfWeek: 'Wednesday', startTime: '20:00', endTime: '21:00', trainer: 'Fiama Martínez', activity: zumba },
        { dayOfWeek: 'Thursday', startTime: '20:00', endTime: '21:00', trainer: 'Fiama Martínez', activity: zumba },
        
        // Telas
        { dayOfWeek: 'Tuesday', startTime: '17:00', endTime: '18:00', trainer: 'Antonella Miracle', activity: telas },
        { dayOfWeek: 'Thursday', startTime: '17:00', endTime: '18:00', trainer: 'Antonella Miracle', activity: telas },
    ];

    for (const schedule of schedules) {
        await this.schedulesService.create(schedule);
    }

    return { message: 'Schedules seeded successfully ✅' };
    }
}