import { IsString, IsEmail, MinLength, IsNotEmpty, MaxLength, Matches } from 'class-validator';

export class CreateUserDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(100)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/, {
        message: 'The password must contain at least one lowercase letter, one uppercase letter, one number, and one special character. (!@#$%^&*).',
    })
    password: string;
}