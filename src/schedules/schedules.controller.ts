import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Schedules')
@Controller('schedules')
export class SchedulesController {
    constructor(private readonly schedulesService: SchedulesService) {}

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
}