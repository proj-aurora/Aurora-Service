import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Agent_Data, AgentDataDocument } from "../schema/agent_data.entity";

// agent.service.ts
@Injectable()
export class AgentService {
  constructor(
    @InjectModel(Agent_Data.name) private agentDataModel: Model<AgentDataDocument>
  ) {}

  async recentData(key: string, limit: number) {
    const log = await this.agentDataModel
      .find({ key: key })
      .sort({ datetime: -1 })
      .limit(limit)
      .exec();

    return log.map((log) => {
      return {
        data: log.data,
      }
    });
  }
}
