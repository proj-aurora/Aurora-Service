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

  @MessagePattern({ check: 'update' })
  async update(@Body() data: { userId: Types.ObjectId, country: string, plan: string }) {

    const { userId, country, plan } = data;
    return this.userService.update(userId, { country, plan });
  }
}