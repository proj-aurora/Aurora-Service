import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AgentController } from "./agent.controller";
import { AgentService } from "./agent.service";
import { Agent_Data, AgentDataSchema } from "../schema/agent_data.entity";
import { SyslogGateway } from "./agent.socket";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Agent_Data', schema: AgentDataSchema }]),
  ],
  controllers: [AgentController],
  providers: [AgentService, SyslogGateway],
})

export class AgentDataModule {
}
