import { Module, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { SubscriptionsModule } from './suscriptions/subscriptions.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AdminModule } from './admin/admin.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PlanSeeder } from './plans/plan.seeder';
import { PlanModule } from './plans/plan.module';
import { MercadoPagoModule } from './mercadopago/mercado.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env.development'
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
       
        return {
        type: "postgres",
        database: configService.get("DB_NAME"),
        host: configService.get("DB_HOST"),
        port: configService.get("DB_PORT"),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD") as string,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: true
      }
      }
       
    }),
    UsersModule,
    SubscriptionsModule,
    AuthModule,
    CloudinaryModule,
    AdminModule,
    PaymentsModule,
    NotificationsModule,
    PlanModule,
    MercadoPagoModule
  ],
})


export class AppModule implements OnApplicationBootstrap {
 
  

  
  constructor(private readonly plans: PlanSeeder){}
  async onApplicationBootstrap() {
   await this.plans.run()

  }
}