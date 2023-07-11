import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import { AgentController } from "./agent.controller";
import { AgentService } from "./agent.service";
import { Agent_Data, AgentDataSchema } from "../schema/agent_data.entity";
import { SyslogGateway } from "./agent.socket";
import { Agent, AgentSchema } from "../schema/agent.entity";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Agent_Data', schema: AgentDataSchema }]),
    MongooseModule.forFeature([{ name: Agent.name, schema: AgentSchema}]),
  ],
  controllers: [AgentController],
  providers: [AgentService, SyslogGateway],
})

export class AgentDataModule {
}
