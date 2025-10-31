import { Controller, Patch, Param, Body, UseGuards, Get, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(AuthGuard('jwt')) // only authenticated admins
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Patch('users/:id/status')
  @ApiOperation({ summary: 'Update the status of a specific user' })
  @ApiParam({ name: 'id', description: 'Unique ID of the user to update', type: String })
  @ApiBody({ description: 'Object containing the new status for the user', type: UpdateUserStatusDto })
  @ApiResponse({ status: 200, description: 'Returns the updated user with the new status.' })
  updateUserStatus(@Param('id') id: string, @Body() dto: UpdateUserStatusDto) {
    return this.adminService.updateUserStatus(id, dto.status);
  }

  @Get('payments')
  @ApiOperation({ summary: 'Retrieve payments, optionally filtered by user' })
  @ApiQuery({ name: 'userId', required: false, description: 'Optional user ID to filter payments', type: String })
  @ApiResponse({ status: 200, description: 'Returns a list of payments, filtered by user if provided.' })
  getPayments(@Query('userId') userId?: string) {
    return this.adminService.getPayments(userId);
  }

  @Get('statistics')
  async getStatistics() {
    return this.adminService.getStatistics();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get complete list of all users with their subscription, payments, trainer and reservations' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns detailed list of all users with their related data.' 
  })
  async getUsersList() {
    return this.adminService.getUsersList();
}

  @Get('statistics/monthly-revenue')
  @ApiOperation({ summary: 'Get total monthly revenue from all paid subscriptions' })
  @ApiResponse({ status: 200, description: 'Returns total monthly revenue' })
  async getMonthlyRevenue() {
    return this.adminService.getMonthlyRevenue();
}

  @Get('statistics/plans/3-days')
  @ApiOperation({ summary: 'Get count of 3-day plans purchased' })
  @ApiResponse({ status: 200, description: 'Returns count of 3-day plans' })
  async get3DaysPlansCount() {
    return this.adminService.getPlansCountByType('3_days');
}

  @Get('statistics/plans/5-days')
  @ApiOperation({ summary: 'Get count of 5-day plans purchased' })
  @ApiResponse({ status: 200, description: 'Returns count of 5-day plans' })
  async get5DaysPlansCount() {
    return this.adminService.getPlansCountByType('5_days');
}

  @Patch('users/:id/activate')
  async activateUser(@Param('id') id: string) {
    return this.adminService.activateUser(id);
}

  @Patch('users/:id/deactivate')
  async deactivateUser(@Param('id') id: string) {
    return this.adminService.deactivateUser(id);
}
}
