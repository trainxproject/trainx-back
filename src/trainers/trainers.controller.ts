import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { AdminGuard, JwtAuthGuard } from 'src/auth/guards/admin.guard';

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

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Seed the default trainers into the database' })
  @ApiResponse({ status: 201, description: 'Seeds four default trainers.' })
  async seed(
    @Body() data: CreateTrainerDto,
    ) {
    return this.trainersService.create(data);
  }

  @Post(":id")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async quali(
    @Param("id", new ParseUUIDPipe()) idTrainer: string,
    @Body("rating")  rating: number,
    @Req() req: any
  ){
    const idUser = req.user.id 
    return this.trainersService.createQuali(idTrainer, idUser, rating) 
  }

  @Get()
  async qualiStatus(){

  }

}