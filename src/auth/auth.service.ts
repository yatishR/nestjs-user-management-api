import { Injectable,UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserDocument,
} from '../users/schema/user.schema';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(User.name)
        private readonly userModel:Model<UserDocument>,
        private readonly jwtService:JwtService
    ){}

    async login(loginDto:LoginDto){
        const {email,password} = loginDto;
        // get user include password
       console.log('1️⃣ Email:', email);
       console.log('2️⃣ Password received:', !!password);

        const user = await this.userModel.findOne({email}).select('+password');
         console.log('3️⃣ User found:', !!user);
        console.log('4️⃣ Password hash exists:', !!user?.password);
        if(!user){
            throw new UnauthorizedException('Invalid email or password');
        }

        // compaired generated  password 

        const isPasswordValid = await bcrypt.compare(password,user.password);
        console.log(
            '5️⃣ Password valid:',
            isPasswordValid,
        );
        if(!isPasswordValid){
            throw new UnauthorizedException(
        'Invalid email or password',
          );
        }

        // create jwt password

        const payload = {
            sub:user._id.toString(),
            email:user.email
        };

        const token = await this.jwtService.signAsync(payload);
        

         return {
            success: true,
            message: 'Login successful',
            token,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
           };
    }

}
