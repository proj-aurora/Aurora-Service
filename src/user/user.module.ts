import {Module} from "@nestjs/common";
import {UserController} from "./user.controller";
import {UserService} from "./user.service";
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "../schema/user.entity";
import { Team, TeamSchema } from "../schema/team.entity";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }])
  ],
  controllers: [UserController],
  providers: [UserService],
})

export class UserModule {}