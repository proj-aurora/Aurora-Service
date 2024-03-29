import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AgentService } from "./agent.service";
import { MessagePattern } from "@nestjs/microservices";
import { Types } from "mongoose";

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @MessagePattern({ check: 'syslog' })
  async recentData(@Body() data: { key: string, limit: number }) {
    const { key, limit } = data;
    return this.agentService.recentData(key, limit);
  }

  @MessagePattern({ check: 'agentList' })
  async getAgentsByTeamId(@Body() data: { teamId: Types.ObjectId, userId: Types.ObjectId }) {
    const { teamId, userId } = data;
    return this.agentService.getAgentsByTeamId(teamId, userId);
  }

  @MessagePattern({ check: 'agentCreate' })
  async createAgent(@Body() data: { teamId: Types.ObjectId, userId: Types.ObjectId, name: string }) {
    const { teamId, userId, name } = data;
    return this.agentService.createAgent(teamId, userId, name);
  }

  @MessagePattern({ check: 'agentUpdate' })
  async updateAgent(@Body() data: { teamId: Types.ObjectId, userId: Types.ObjectId, agentId: Types.ObjectId, name: string }) {
    const { teamId, userId, agentId, name } = data;
    return this.agentService.updateAgent(teamId, agentId, userId, name);
  }

  @MessagePattern({ check: 'agentDelete' })
  async deleteAgent(@Body() data: { teamId: Types.ObjectId, userId: Types.ObjectId, agentId: Types.ObjectId }) {
    const { teamId, userId, agentId } = data;
    return this.agentService.deleteAgent(teamId, agentId, userId);
  }

}