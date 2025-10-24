import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Correo electrónico del destinatario de la notificación',
    example: 'usuario@trainx.com',
  })
  @IsEmail()
  recipientEmail: string;

  @ApiProperty({
    description: 'Tipo de notificación',
    example: 'like',
    enum: ['like', 'comment'],
  })
  @IsNotEmpty()
  type: 'like' | 'comment';

  @ApiProperty({
    description: 'Título de la foto relacionada con la notificación',
    example: 'Entrenamiento de piernas',
  })
  @IsNotEmpty()
  photoTitle: string;

  @ApiPropertyOptional({
    description: 'Comentario asociado (si aplica)',
    example: 'Excelente progreso 💪',
  })
  @IsOptional()
  comment?: string;
}
