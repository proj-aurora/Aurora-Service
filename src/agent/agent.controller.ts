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

}