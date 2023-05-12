import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './mongo/user.entity'; // User model import
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CacheModule } from "@nestjs/common";
import { SignModule } from "./sign/sign.module";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // User model registration
    ConfigModule.forRoot(),
    CacheModule.register(),
    SignModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
