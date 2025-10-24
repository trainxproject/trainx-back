import { Module } from '@nestjs/common';
import { MpController } from './mercado.controller';
import { MpService } from './mercado.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pay } from 'src/payments/entities/payment.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Pay])],
  controllers: [MpController],
  providers: [MpService]
})
export class MercadoPagoModule {}