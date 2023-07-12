// team.controller.ts
import { Controller, Post, Body, Delete, Get } from "@nestjs/common";
import { TeamService } from './team.service';
import { Types } from "mongoose";
import { MessagePattern } from "@nestjs/microservices";

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @MessagePattern({ check: 'teamInfo' })
  async teamInfo(@Body() data: { teamId: Types.ObjectId, userId: Types.ObjectId }) {
    const { teamId, userId } = data;
    return await this.teamService.teamInfo(teamId, userId);
  }

  // @Post('create')
  @MessagePattern({ check: 'teamCreate' })
  async createTeam(@Body() data: { name: string, plan: string,  userId: Types.ObjectId }) {
    const { name, plan, userId } = data;
    return await this.teamService.createTeam(name, plan, userId);
  }

  // @Delete('delete')
  @MessagePattern({ check: 'teamDelete' })
  async deleteTeam(@Body() _id: Types.ObjectId) {
    return await this.teamService.deleteTeam(_id);
  }

  // @Post('join')
  @MessagePattern({ check: 'teamJoin' })
  async joinTeam(@Body() body: { registrationCode: string, userId: Types.ObjectId }) {
    const { registrationCode, userId } = body;
    return await this.teamService.joinTeamBySelf(registrationCode, userId);
  }

  @MessagePattern({ check: 'teamLeave' })
  async memberList(@Body() body: { teamId: Types.ObjectId, userId: Types.ObjectId }) {
    const { teamId, userId } = body;
    return await this.teamService.leaveTeam(teamId, userId);
  }

  @MessagePattern({ check: 'teamMemberList' })
  async leaveTeam(@Body() body: { teamId: Types.ObjectId, userId: Types.ObjectId }) {
    const { teamId, userId } = body;
    return await this.teamService.memberList(teamId, userId);
  }

  @MessagePattern({ check: 'teamInfoUpdate' })
  async updateTeam(@Body() body: { teamId: Types.ObjectId, userId: Types.ObjectId, name: string, plan: string }) {
    const { teamId, userId, name, plan } = body;
    return await this.teamService.updateTeam(teamId, name, plan, userId);
  }

  @MessagePattern({ check: 'inviteUser' })
  async inviteUserToTeam(@Body() body: { teamId: Types.ObjectId, userId: Types.ObjectId, email: string }) {
    const { teamId, userId, email } = body;
    return await this.teamService.inviteUser(teamId, email, userId);
  }


}