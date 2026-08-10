import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  User,
  UserSchema,
} from '../users/schema/user.schema';

@Module({
  imports:[
     MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    PassportModule,
     JwtModule.registerAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),

        signOptions: {
          expiresIn: '7d',
        },
      }),
    }),
    //  JwtModule.register({
    //   secret: 'my-secret-key',
    //   signOptions: {
    //     expiresIn: '7d',
    //   },
    // }),
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  exports:[JwtModule,
    PassportModule]
})
export class AuthModule {}
