// team.service.ts
import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Team } from "../schema/team.entity";
import { Member } from "../schema/members.entity";
import { Group } from "../schema/group.entity";
import { randomValue } from "../../utils/crypto.utils";
import { UserService } from "../user/user.service";
import { Agent } from "../schema/agent.entity";
import * as moment from "moment-timezone";
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
    return moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
  }

  async fullName(_id: Types.ObjectId) {
    const user = await this.userService.getUserById(_id);
    return user.data.name. firstName + ' ' + user.data.name.lastName;
  }

  async memberList(teamId: Types.ObjectId, userId: Types.ObjectId) {
    const team = await this.teamModel.findById(teamId);

    const checkMember = await this.checkMember(teamId, userId);

    if (checkMember === false) {
      return {
        success: false,
        data: {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: "You're not part of the team",
        },
      };
    }

    const members = team.members.map(member => member.toString());
    return this.memberModel.find({ _id: { $in: members } });
  }

  async teamInfo(teamId: Types.ObjectId, userId: Types.ObjectId) {
    const team = await this.teamModel.findById(teamId);

    if (!team) {
      return {
        success: false,
        data: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Team not found',
        },
      };
    }

    const members = team.members.map(member => member.toString());

    const you = await this.memberModel.findOne({ userId: userId, teamId: teamId });

    const member = await this.memberModel.find({ _id: { $in: members } });

    const userIds = member.map(member => member.userId ); // Extract userIds as strings

    const users = await this.userModel.find({ _id: { $in: userIds } });

    const authorizedUser = users.find(user => user._id.toString() === userId.toString());
    if (!authorizedUser) {
      return {
        success: false,
        data: {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: "You're not part of the team",
        },
      };
    }

    return {
      success: true,
      data: {
        team,
        you
      }
    };
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
      userId: _id,
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

  async checkMember(teamId: Types.ObjectId, userId: Types.ObjectId) {
    const member = this.memberModel.find({ teamId: teamId, userId: userId });
    if (member) {
      return true;
    }
  }

  async joinTeamBySelf(registrationCode: string, _id: Types.ObjectId) {
    const team = await this.teamModel.findOne({ registrationCode });
    if (!team) {
      return {
        success: false,
        data: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Team not found',
        }
      }
    }

    const nowDate = await this.nowDate();
    const fullName = await this.fullName(_id);

    const checkMember = await this.memberModel.findOne({ teamId: team._id, userId: _id });
    if (checkMember) {
      return {
        success: false,
        data: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'You already joined this team',
        }
      }
    }

    const user  = await this.userModel.findOne({ _id: _id })

    const member = new this.memberModel({
      teamId: team._id,
      userId: _id,
      name: fullName,
      email: user.email,
      phone: user.phone,
      permission: 'member',
      lastUpdatedAt: nowDate,
      lastUpdatedBy: fullName,
    });

    team.members.push(member._id);
    user.team.push(team._id)

    await member.save();
    await team.save()
    await user.save();

    return {
      success: true,
      data: {
        statusCode: HttpStatus.OK,
        message: 'Team joined successfully',
      }
    }
  }

  async leaveTeam(teamId: Types.ObjectId, userId: Types.ObjectId) {
    const team = await this.teamModel.findById(teamId);
    if (!team) {
      return {
        success: false,
        data: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Team not found',
        }
      }
    }

    const member = await this.memberModel.findOne({ teamId, userId });

    if (!member) {
      return {
        success: false,
        data: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Member not found',
        }
      }
    }

    const user = await this.userModel.findById(userId);
    if (user) {
      user.team = user.team.filter(t => !t.equals(teamId));
      await user.save();
    }

    // Remove the userId from the team's members array
    team.members = team.members.filter(m => !m.equals(member._id));
    await team.save();

    // Delete the member from the team
    await member.deleteOne();

    return {
      success: true,
      data: {
        statusCode: HttpStatus.OK,
        message: 'Team left successfully',
      }
    }
  }

  async updateTeam(teamId: Types.ObjectId, name: string, plan: string, userId: Types.ObjectId) {
    const team = await this.teamModel.findById(teamId);
    if (!team) {
      return {
        success: false,
        data: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Team not found',
        }
      }
    }

    await this.checkMember(teamId, userId)
    if (!this.checkMember) {
      return {
        success: false,
        statusCode: HttpStatus.FORBIDDEN,
        data: {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'You are not a member of this team',
        }
      }
    }

    team.name = name;
    team.plan = plan;

    await team.save();

    return {
      success: true,
      data: {
        statusCode: HttpStatus.CREATED,
        message: 'Team updated successfully',
      }
    }
  }

  async inviteUser(teamId: Types.ObjectId, email: string, userId: Types.ObjectId) {
    const team = await this.teamModel.findById(teamId);

    if (!team) {
      return {
        success: false,
        data: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Team not found',
        }
      }
    }

    const checkMember = await this.checkMember(teamId, userId)
    if (!checkMember) {
      return {
        success: false,
        data: {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'You are not a member of this team',
        }
      }
    }

    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      return {
        success: false,
        data: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
        }
      }
    }

    const checkInviteUser = await this.memberModel.findOne({ teamId: team._id, userId: user._id });
    if (checkInviteUser) {
      return {
        success: false,
        data: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'User already joined this team',
        }
      }
    }

    const nowDate = await this.nowDate();
    const fullName = await this.fullName(user._id);

    const member = new this.memberModel({
      teamId: team._id,
      userId: user._id,
      name: fullName,
      email: user.email,
      phone: user.phone,
      permission: 'member',
      lastUpdatedAt: nowDate,
      lastUpdatedBy: fullName,
    });

    team.members.push(member._id);
    user.team.push(team._id)

    await member.save();
    await team.save();
    await user.save();

    return {
      success: true,
      data: {
        statusCode: HttpStatus.CREATED,
        message: 'User invited successfully',
      }
    }
  }
}
