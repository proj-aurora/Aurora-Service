import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import { AgentController } from "./agent.controller";
import { AgentService } from "./agent.service";
import { Agent_Data, AgentDataSchema } from "../schema/agent_data.entity";
import { SyslogGateway } from "./agent.socket";
import { Agent, AgentSchema } from "../schema/agent.entity";
import { Group, GroupSchema } from "../schema/group.entity";
import { Team, TeamSchema } from "../schema/team.entity";
import { Member, MemberSchema } from "../schema/members.entity";
import { UserService } from "../user/user.service";
import { User, UserSchema } from "../schema/user.entity";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Agent_Data', schema: AgentDataSchema }]),
    MongooseModule.forFeature([{ name: Agent.name, schema: AgentSchema}]),
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema}]),
    MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]),
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema}])
  ],
  controllers: [AgentController],
  providers: [AgentService, SyslogGateway, UserService],
})

export class AgentModule {
}
