import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AgentService } from "./agent.service";
import { MessagePattern } from "@nestjs/microservices";

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @MessagePattern({ check: 'syslog' })
  async recentData(@Body() data: { key: string, limit: number }) {
    const { key, limit } = data;
    return this.agentService.recentData(key, limit);
  }
}