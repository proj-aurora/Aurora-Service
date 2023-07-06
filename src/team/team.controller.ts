// team.controller.ts
import { Controller, Post, Body, Delete, Get } from "@nestjs/common";
import { TeamService } from './team.service';
import { Types } from "mongoose";
import { MessagePattern } from "@nestjs/microservices";

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @MessagePattern({ check: 'info' })
  async teamInfo(@Body() data: { teamId: Types.ObjectId, userId: Types.ObjectId }) {
    const { teamId, userId } = data;
    return await this.teamService.teamInfo(teamId, userId);
  }

  // @Post('create')
  @MessagePattern({ check: 'create' })
  async createTeam(@Body() data: { name: string, plan: string,  userId: Types.ObjectId }) {
    const { name, plan, userId } = data;
    return await this.teamService.createTeam(name, plan, userId);
  }

  // @Delete('delete')
  @MessagePattern({ check: 'delete' })
  async deleteTeam(@Body() _id: Types.ObjectId) {
    return await this.teamService.deleteTeam(_id);
  }

  // @Post('join')
  @MessagePattern({ check: 'join' })
  async joinTeam(@Body() body: { registrationCode: string, userId: Types.ObjectId }) {
    console.log(body)
    const { registrationCode, userId } = body;
    return await this.teamService.joinTeamByRegistrationCode(registrationCode, userId);
  }

  @Get('hello')
  async hello() {
    return 'hello'
  }

}