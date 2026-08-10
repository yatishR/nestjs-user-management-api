import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  User,
  UserDocument,
} from './schema/user.schema';
import * as bcrypt from 'bcrypt';
import {CreateUserDto } from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {
  NotFoundException,
} from '@nestjs/common';


@Injectable()
export class UsersService {

    constructor(@InjectModel(User.name)
               private readonly userModel:Model<UserDocument>,
){}
async createUser(userData:CreateUserDto){
    const hasPassword = await bcrypt.hash(userData.password,10)
    const user = await this.userModel.create({
        name: userData.name,
        email: userData.email,
        password: hasPassword,
    });
    return {
        name:userData.name,
        email:userData.email,
        password:hasPassword
    } 
}

async updateUser(id:string,updateUserDto:UpdateUserDto){
    const user = await this.userModel.findByIdAndUpdate(
        id,
        updateUserDto,
        {
           returnDocument: 'after',
            runValidators:true
        }
    )

    if(!user){
        throw new NotFoundException('User not found');
    }

    return{
        success:true,
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            },
    }
}

async deleteUser(id:string){
    const user = await this.userModel.findByIdAndDelete(id);
    if(!user){
        throw new NotFoundException("user not found");
    }
    return {
        success:true,
        message:"User Deleted Successfully"
    }
}

async FindAll(){
    return this.userModel.find().select('-password');
}
async findOne(id: string) {
  try {
    const user = await this.userModel
      .findById(id)
      .select('-password');

    if (!user) {
      throw new NotFoundException(
        'User Not Found',
      );
    }

    return {
      success: true,
      data: user,
    };

  } catch (error) {
    throw error;
  }
}

// async findOne(id:string){
//     console.log('🔍 ID received:', id);
//     const user = await this.userModel.findById(id).select('-password');
//      console.log('👤 User found:', user);

//     if(!user){
//         console.log('❌ User does not exist');
//         throw new NotFoundException(" User Not Found");
        
//     }
//      return {
//     success: true,
//     data: user,
//   };
// }



}
