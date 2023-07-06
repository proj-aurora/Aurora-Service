import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../schema/user.entity";
import { Team, TeamDocument } from "../schema/team.entity";
import { Model, Types } from "mongoose";
import { AsyncResponseBody } from "../model/ResponseBody";
import { UserUpdateDto } from "../dto/user_update.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Team.name) private teamModel: Model<TeamDocument>,
  ) {}

  async getUserById(_id: Types.ObjectId) {
    const userInfo = await this.userModel.findById(_id)
    return {
      success: true,
      data: userInfo
    }
  }

  async getUserByEmail(email: string): AsyncResponseBody<User> {
    const userInfo = await this.userModel.findOne({email})
    return {
      success: true,
      data: userInfo
    }
  }

  async getTeamList(userId: Types.ObjectId) {
    const user = await this.getUserById(userId)
    const teamList = JSON.parse(JSON.stringify(user.data.team))
    console.log(teamList)
    const some = await this.teamModel.find({ _id: { $in: teamList } })
    return {
      success: true,
      data: some
    }
  }

  async update(_id: Types.ObjectId, updateUserDto: UserUpdateDto): Promise<UserDocument> {
    const updatedUser = await this.userModel.findByIdAndUpdate(_id, updateUserDto, { new: true });
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return updatedUser;
  }
}