import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ description: 'Full name of the user', example: 'John Doe' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Email address of the user', example: 'john.doe@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Password for the user account, minimum 6 characters', example: 'securePass123' })
    @IsString()
    @MinLength(6)
    password: string;
}
