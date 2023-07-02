import {Module} from "@nestjs/common";
import {TeamController} from "./team.controller";
import {TeamService} from "./team.service";
import {MongooseModule} from "@nestjs/mongoose";
import {Team, TeamSchema} from "../schema/team.entity";
import {User, UserSchema} from "../schema/user.entity";
import {Group, GroupSchema} from "../schema/group.entity";
import {Member, MemberSchema} from "../schema/members.entity";
import {Agent, AgentSchema} from "../schema/agent.entity";
import {UserService} from "../user/user.service";

@Module({
    imports: [
      MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema}]),
      MongooseModule.forFeature([{ name: User.name, schema: UserSchema}]),
      MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema}]),
      MongooseModule.forFeature([{ name: Agent.name, schema: AgentSchema}]),
      MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema}]),
    ],
    controllers: [TeamController],
    providers: [TeamService, UserService],
})

export class TeamModule {
}