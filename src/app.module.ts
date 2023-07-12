import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CacheModule } from "@nestjs/common";
import { User, UserSchema } from './schema/user.entity'; // User model import
import { Team, TeamSchema } from "./schema/team.entity"; // Team model import
import { SignModule } from "./sign/sign.module";
import { TeamModule } from "./team/team.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { InfluxDBModule } from "./influx/influx.module";
import { AgentModule } from "./agent/agent.module";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // User model registration
    MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]), // Team model registration
    ConfigModule.forRoot(),
    CacheModule.register(),
    SignModule,
    TeamModule,
    UserModule,
    AuthModule,
    InfluxDBModule,
    AgentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
