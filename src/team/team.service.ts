// team.service.ts
import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Team } from "../schema/team.entity";
import { Member } from "../schema/members.entity";
import { Group } from "../schema/group.entity";
import { pollute, randomValue } from "../../utils/crypto.utils";
import { UserService } from "../user/user.service";
import { Agent } from "../schema/agent.entity";
import * as moment from "moment";

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<Team>,
    @InjectModel(Member.name) private memberModel: Model<Member>,
    @InjectModel(Group.name) private groupModel: Model<Group>,
    @InjectModel(Agent.name) private agentModel: Model<Agent>,
    private readonly userService: UserService,
  ) {}

  async nowDate() {
    return moment().format('YYYY-MM-DD HH:mm:ss')
  }

  async idValue() {
    const objectIdString = '64a127b1702f3d306fd4a524'; // get id from token
    const _id: Types.ObjectId = new Types.ObjectId(objectIdString);
    console.log('_id',_id);
    return _id;
  }

  async fullName() {
    const id = await this.idValue()
    const user = await this.userService.getUserById(id)
    return user.data.name. firstName + ' ' + user.data.name.lastName;
  }

  async createTeam(name: string) {
    const id = await this.idValue()
    const user = await this.userService.getUserById(id)
    const randomCode = randomValue(); // random code
    const nowDate = await this.nowDate();
    const fullName = await this.fullName();

    const team = new this.teamModel({ name, registrationCode: randomCode });
    team.createdAt = await this.nowDate();
    team.owner = await this.fullName();

    // Create initial member data
    const member = new this.memberModel({
      id: team._id,
      name: await this.fullName(),
      email: user.data.email,
      phone: user.data.phone,
      lastUpdatedAt: nowDate,
      lastUpdatedBy: fullName,
    });

    team.members = [member._id];

    // Create initial group data
    const group = new this.groupModel({
      id: team._id,
      lastUpdatedAt: nowDate,
      lastUpdatedBy: fullName,
    });
    team.group = [group._id];

    // Create initial agent data
    const agent = new this.agentModel({
      id: group._id,
      lastUpdatedAt: nowDate,
      lastUpdatedBy: fullName,
    });
    group.agents = [agent._id];

    // Save all data
    await member.save();
    await group.save();
    await agent.save();
    await team.save();

    return team;
  }

  async deleteTeam(_id: Types.ObjectId) {
    // Find the team by ID
    const team = await this.teamModel.findById(_id);
    if (!team) {
      return {
        success: false,
        data: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Team not found',
        }
      }
    }

    // Delete the team's members
    await this.memberModel.deleteMany({ id: _id });

    // Delete the team's agents
    const group = await this.groupModel.find({ id: _id });
    await this.agentModel.deleteMany({ id: group[0]._id })

    // Delete the team's groups
    await this.groupModel.deleteMany({ id: _id });

    // Delete the team
    await team.deleteOne();

    return {
      success: true,
      data: {
        statusCode: HttpStatus.OK,
        message: 'Team deleted successfully',
      }
    }
  }

  async StandByStatus(_id: Types.ObjectId) {
  }

  async joinTeamByRegistrationCode(registrationCode: string, _id: Types.ObjectId) {
    const team = await this.teamModel.findOne({ registrationCode });
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    console.log('team', team)
    const nowDate = await this.nowDate();
    const fullName = await this.fullName();

    const user = await this.userService.getUserById(_id)

    const member = new this.memberModel({
      id: team._id,
      name: await this.fullName(),
      email: user.data.email,
      phone: user.data.phone,
      permission: 'member',
      lastUpdatedAt: nowDate,
      lastUpdatedBy: fullName,
    });

    team.members.push(member._id);

    return {
      success: true,
      data: {
        statusCode: HttpStatus.OK,
        message: 'Team joined successfully',
      }
    }
  }
}
