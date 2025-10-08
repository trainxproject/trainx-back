import { Controller, Post, Body, UseGuards, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import type { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  // Logout protegido (opcional): si querés que solo un usuario autenticado pueda "cerrar sesión" en el servidor
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req: Request) {
    return this.authService.logout();
  }

   // 🔹 1. Redirige al usuario a la página de Google para iniciar sesión
   @Get('google')
   @UseGuards(GoogleAuthGuard)
   async googleLogin() {
     return { msg: 'Redirigiendo a Google...' };
   }
 
   // 🔹 2. Google redirige acá después del login
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user;
    const jwt = await this.authService.validateGoogleUser(user);
    return res.redirect(`http://localhost:5173?token=${jwt}`);
  }
}