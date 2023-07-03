// team.controller.ts
import { Controller, Post, Body, Delete, Get } from "@nestjs/common";
import { TeamService } from './team.service';
import { Types } from "mongoose";
import { MessagePattern } from "@nestjs/microservices";

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  // @Post('create')
  @MessagePattern({ check: 'create' })
  async createTeam(@Body() data: { name: string }) {
    const { name } = data;
    return await this.teamService.createTeam(name);
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