import { Controller, Get, Post, Delete, Param, Body, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @ApiOperation({ summary: 'Retrieve all users registered in the platform' })
    @ApiResponse({ status: 200, description: 'Returns an array of all users, including details like ID, name, email, and profile picture.' })
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a specific user by their ID' })
    @ApiParam({ name: 'id', description: 'Unique ID of the user to retrieve', type: String })
    @ApiResponse({ status: 200, description: 'Returns the user details for the specified ID.' })
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new user in the platform' })
    @ApiBody({ description: 'Partial user object containing the necessary data to create a user.', type: Object })
    @ApiResponse({ status: 201, description: 'Returns the newly created user with all its details.' })
    create(@Body() user: Partial<User>) {
        return this.usersService.create(user);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove a user by their ID' })
    @ApiParam({ name: 'id', description: 'Unique ID of the user to remove', type: String })
    @ApiResponse({ status: 200, description: 'Returns confirmation that the user was successfully removed.' })
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }

    @Patch(':id/profile-picture')
    @ApiOperation({ summary: 'Update the profile picture of a specific user' })
    @ApiParam({ name: 'id', description: 'Unique ID of the user whose profile picture will be updated', type: String })
    @ApiBody({ description: 'Object containing the new image URL for the profile picture.', type: Object })
    @ApiResponse({ status: 200, description: 'Returns the user with the updated profile picture.' })
    async uploadProfilePicture(@Param('id') id: string, @Body() body: { imageUrl: string }) {
        return this.usersService.uploadProfilePicture(id, body.imageUrl);
    }
}
