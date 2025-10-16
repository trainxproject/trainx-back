import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ description: 'Email address of the user', example: 'john.doe@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Password of the user', example: 'securePass123' })
    @IsString()
    password: string;
}
