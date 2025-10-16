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
}
