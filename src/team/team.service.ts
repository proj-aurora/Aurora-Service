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
import { User } from "../schema/user.entity";

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Team.name) private teamModel: Model<Team>,
    @InjectModel(Member.name) private memberModel: Model<Member>,
    @InjectModel(Group.name) private groupModel: Model<Group>,
    @InjectModel(Agent.name) private agentModel: Model<Agent>,
    private readonly userService: UserService,
  ) {}

  async nowDate() {
    return moment().format('YYYY-MM-DD HH:mm:ss')
  }

  async fullName(_id: Types.ObjectId) {
    const user = await this.userService.getUserById(_id);
    return user.data.name. firstName + ' ' + user.data.name.lastName;
  }

  async teamInfo(teamId: Types.ObjectId, userId: Types.ObjectId) {
    const team = await this.teamModel.findById(teamId);
    const user = await this.userService.getUserById(userId);
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    return team;
  }

  async createTeam(name: string, plan: string, _id: Types.ObjectId) {
    const user = await this.userService.getUserById(_id)
    const randomCode = randomValue(); // random code
    const nowDate = await this.nowDate();
    const fullName = await this.fullName(_id);

    const team = new this.teamModel({ name, plan, registrationCode: randomCode });
    team.createdAt = nowDate;
    team.owner = fullName;
    team.plan = plan;

    // Create initial member data
    const member = new this.memberModel({
      teamId: team._id,
      name: fullName,
      email: user.data.email,
      phone: user.data.phone,
      lastUpdatedAt: nowDate,
      lastUpdatedBy: fullName,
    });

    team.members = [member._id];

    // Create initial group data
    const group = new this.groupModel({
      teamId: team._id,
      lastUpdatedAt: nowDate,
      lastUpdatedBy: fullName,
    });
    team.group = [group._id];

    // Create initial agent data
    const agent = new this.agentModel({
      groupId: group._id,
      key: randomValue(),
      account: randomValue(),
      lastUpdatedAt: nowDate,
      lastUpdatedBy: fullName,
    });
    group.agents = [agent._id];

    // Save all data
    await member.save();
    await group.save();
    await agent.save();
    await team.save();

    const belongsToTeam  = await this.userModel.findOne({ _id: _id })
    belongsToTeam.team.push(team._id)
    await belongsToTeam.save();

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

    await this.userModel.updateMany({ team: { _id } }, { $pull: { team: { _id } } })

    // Delete the team's members
    await this.memberModel.deleteMany({ teamId: _id });

    // Delete the team's agents
    const group = await this.groupModel.find({ teamId: _id });
    await this.agentModel.deleteMany({ groupId: group[0]._id })

    // Delete the team's groups
    await this.groupModel.deleteMany({ teamId: _id });

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
    const nowDate = await this.nowDate();
    const fullName = await this.fullName(_id);

    const user = await this.userService.getUserById(_id)

    const member = new this.memberModel({
      teamId: team._id,
      name: fullName,
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
