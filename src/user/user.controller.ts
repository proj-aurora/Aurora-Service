import {Body, Controller, Post, Put} from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import {Types} from "mongoose";
import {UserService} from "./user.service";
import {Request} from "@nestjs/common";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ check: 'id' })
  async getUserById(@Body() _id: Types.ObjectId ) {
    return this.userService.getUserById(_id);
  }


  @MessagePattern({ check: 'email' })
  async getUserByEmail(@Body() email: string ) {
    return this.userService.getUserByEmail(email);
  }

  @MessagePattern({ check: 'team' })
  async getTeamList(@Body() userId: Types.ObjectId ) {
    return this.userService.getTeamList(userId);
  }

  @MessagePattern({ check: 'newPW' })
  async updatePW(@Body() data: { userId: Types.ObjectId, currentPW: string, newPW: string }) {
    const { userId, currentPW, newPW } = data;
    return this.userService.newPassword(userId, currentPW, newPW);
  }

  @MessagePattern({ check: 'update' })
  async update(@Body() data: { userId: Types.ObjectId, country: string, firstName: string, lastName: string, currentPW }) {

    const { userId, country, firstName, lastName, currentPW } = data;
    return this.userService.update(userId, { country, firstName, lastName, currentPW });
  }
}