// team.controller.ts
import { Controller, Post, Body, Delete, Get, Res, Req } from "@nestjs/common";
import { TeamService } from './team.service';
import { Types } from "mongoose";
import { MessagePattern } from "@nestjs/microservices";
import { Response } from "express";

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
  async deleteTeam(@Body() data: { teamId: Types.ObjectId, userId: Types.ObjectId }) {
    const { teamId, userId } = data;
    return await this.teamService.deleteTeam(teamId, userId);
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

  @MessagePattern({ check: 'memberExpulsion' })
  async memberExpulsion(@Body() body: { [key: string]: { teamId: Types.ObjectId, memberId: Types.ObjectId } | Types.ObjectId }) {
    const userId: Types.ObjectId = body.userId as Types.ObjectId; // Explicitly extract userId
    const teamsAndMembers = { ...body };
    delete teamsAndMembers.userId; // Remove userId from the teamsAndMembers object
    const teamMemberPairs: Array<{ teamId: Types.ObjectId, memberId: Types.ObjectId }> =
      Object.values(teamsAndMembers).filter((value): value is { teamId: Types.ObjectId, memberId: Types.ObjectId } => 'teamId' in value && 'memberId' in value);
    return await this.teamService.memberExpulsion(userId, teamMemberPairs);
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

  @MessagePattern({ check: 'changeOwner' })
  async changeOwner(@Body() body: { teamId: Types.ObjectId, userId: Types.ObjectId, memberId: Types.ObjectId }) {
    const { teamId, userId, memberId } = body;
    return await this.teamService.changeOwner(teamId, memberId, userId);
  }
}