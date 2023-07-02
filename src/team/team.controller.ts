// team.controller.ts
import { Controller, Post, Body, Delete } from "@nestjs/common";
import { TeamService } from './team.service';
import { Types } from "mongoose";

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post('create')
  async createTeam(@Body() body: { name: string }) {
    const { name } = body;
    return await this.teamService.createTeam(name);
  }

  @Delete('delete')
  async deleteTeam(@Body() _id: Types.ObjectId) {
    return await this.teamService.deleteTeam(_id);
  }

}