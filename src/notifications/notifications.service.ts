import { Injectable, Logger, BadRequestException, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from './dto/sendEmail.dto';

@Injectable()
export class NotificationsService {
  private transporter;
  private logger = new Logger(NotificationsService.name);

  constructor(private configService: ConfigService) {
    const user = this.configService.get<string>('EMAIL_USER');
    const pass = this.configService.get<string>('EMAIL_PASS');

    console.log('EMAIL_USER:', user);
    console.log('EMAIL_PASS:', pass ? '****' : 'NOT SET');

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user, pass },
    });

    // setTimeout(()=>{
    //   this.transporter.verify()
    //   .then(() => this.logger.log('✅ Mail transporter ready'))
    //   .catch(err => this.logger.error('❌ Mail transporter verification failed', err));
    // })
    
  }


  private buildWelcomeMessage(dto: SendEmailDto) {
    const { name } = dto;
    return {
      subject: '💪 Bienvenido a TrainX 💪',
      message: `
Hola ${name} 👋

¡Bienvenido a **TrainX**, tu nuevo aliado para alcanzar tus metas fitness! 🏋️‍♂️🔥  
Aquí podrás registrar tus entrenamientos, seguir tu progreso y mantenerte motivado día a día.

En TrainX creemos en la constancia, la disciplina y en superar tus propios límites.  
Prepárate para llevar tu entrenamiento al siguiente nivel. 🚀

¡Gracias por unirte a la comunidad TrainX!  
El equipo de TrainX 💙
      `,
    };
  }

  // private buildActivityMessage(dto: CreateNotificationDto) {
  //   const { type, photoTitle, comment } = dto;

  //   if (type === 'like') {
  //     return {
  //       subject: `🎉 Tu foto "${photoTitle}" recibió un like!`,
  //       message: `¡Alguien le dio like a tu foto "${photoTitle}" en TrainX! 💙`,
  //     };
  //   } else if (type === 'comment') {
  //     return {
  //       subject: `💬 Nuevo comentario en tu foto "${photoTitle}"`,
  //       message: `Alguien comentó en tu foto "${photoTitle}":\n\n"${comment}"`,
  //     };
  //   } else {
  //     throw new BadRequestException('Tipo de notificación inválido');
  //   }
  // }

  public async sendEmail(to: string, subject: string, message: string) {
    try {
      const info = await this.transporter.sendMail({
        from: `"Train-X" <${this.configService.get('EMAIL_USER')}>`,
        to,
        subject,
        text: message,
      });

      this.logger.log(`Correo enviado: ${info.messageId} a ${to}`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Error enviando correo a ${to}: ${error.message}`, error.stack);
      return { success: false, error: error.message };
    }
  }

  async sendWelcome(dto: SendEmailDto) {
    const { subject, message } = this.buildWelcomeMessage(dto);
    return this.sendEmail(dto.email, subject, message);
  }

  // async sendActivity(dto: CreateNotificationDto) {
  //   const { subject, message } = this.buildActivityMessage(dto);
  //   return this.sendEmail(dto.recipientEmail, subject, message);
  // }
}
