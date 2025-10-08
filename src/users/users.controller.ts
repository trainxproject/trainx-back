import { Controller, Get, Post, Delete, Param, Body, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Post()
    create(@Body() user: Partial<User>) {
        return this.usersService.create(user);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }

    @Patch(':id/profile-picture')
    async uploadProfilePicture(@Param('id') id: string, @Body() body: { imageUrl: string }) {
    return this.usersService.uploadProfilePicture(id, body.imageUrl);
    }
}