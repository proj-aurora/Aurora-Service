import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../mongo/user.entity";
import { SignController } from "./sign.controller";
import { SignService } from "./sign.service";


@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [SignController],
  providers: [SignService],
})

export class SignModule {}