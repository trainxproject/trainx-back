import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Trainer } from '../trainers/entities/trainer.entity';
import { TrainersModule } from '../trainers/trainers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Trainer]),
    CloudinaryModule,
    TrainersModule
  ], 
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], 
})
export class UsersModule {}