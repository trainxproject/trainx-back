import { Controller, Get, Post } from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Trainers')
@Controller('trainers')
export class TrainersController {
  constructor(private readonly trainersService: TrainersService) {}

  @Get()
  @ApiOperation({ summary: 'List all trainers available in the platform' })
  @ApiResponse({ status: 200, description: 'Returns a list of trainers.' })
  findAll() {
    return this.trainersService.findAll();
  }

  @Post('seeder')
  @ApiOperation({ summary: 'Seed the default trainers into the database' })
  @ApiResponse({ status: 201, description: 'Seeds four default trainers.' })
  seed() {
    return this.trainersService.seed();
  }
}