import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';


@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [PlanController],
  providers: [PlanService],
})
export class AppModule {}