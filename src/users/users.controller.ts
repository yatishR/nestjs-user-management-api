import { Controller,Get , Body,Post,Put,UseGuards, Delete,Param} from '@nestjs/common';
import {CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  JwtAuthGuard,
} from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly userService:UsersService){}

    @Get()
    @UseGuards(JwtAuthGuard)
   async getUser(){
      const users = await this.userService.FindAll();

        return {
            success:true,
            data:users
        };
    }


    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getUserById(@Param('id') id:string){
        const user = await this.userService.findOne(id)

        return {
            success:true,
            data:user
        };
    }

    @Post()
    @UseGuards(JwtAuthGuard)
   async  createUser(@Body() createUserDto:CreateUserDto){
        const user = await this.userService.createUser(createUserDto)
      
        return{
            success:true,
            message:"user created successfully",
            data:user
           
        };

    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async updateUser(
        @Param('id') id: string,
        @Body() updateUserDto:UpdateUserDto
    ){
         console.log('Controller ID:', id);
        return this.userService.updateUser(id,updateUserDto)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteUser(@Param('id') id:string){
        return this.userService.deleteUser(id)
    }

}
