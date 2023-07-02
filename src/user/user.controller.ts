import {Body, Controller, Post, Put} from "@nestjs/common";
import {UserService} from "./user.service";
import {Types} from "mongoose";
import {UserUpdateDto} from "../dto/user_update.dto";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('_id')
  async getUserById(@Body() _id: Types.ObjectId) {
    return this.userService.getUserById(_id);
  }

  @Post('email')
  async getUserByEmail(@Body() body: { email: string }) {
    const { email } = body;
    return this.userService.getUserByEmail(email);
  }

  @Put('update')
  async update(@Body() body: { _id: Types.ObjectId, updateUserDto: UserUpdateDto }) {
    const { _id, updateUserDto } = body;
    return this.userService.update(_id, updateUserDto);
  }
}