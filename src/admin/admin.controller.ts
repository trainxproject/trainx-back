import { Controller, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { Get, Query } from '@nestjs/common';

@Controller('admin')
@UseGuards(AuthGuard('jwt')) // solo admin autenticado
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Patch('users/:id/status')
  async updateUserStatus(@Param('id') id: string, @Body() dto: UpdateUserStatusDto) {
    return this.adminService.updateUserStatus(id, dto.status);
  }
  @Get('payments')
  async getPayments(@Query('userId') userId?: string) {
  return this.adminService.getPayments(userId);
}
}
