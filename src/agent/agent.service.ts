import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Agent_Data } from "../schema/agent_data.entity";
import { Agent } from "../schema/agent.entity";
import { Group } from "../schema/group.entity";
import { Team } from "../schema/team.entity";
import { Member } from "../schema/members.entity";
import { randomValue } from "../../utils/crypto.utils";
import * as moment from "moment-timezone";
import { UserService } from "../user/user.service";

// agent.service.ts
@Injectable()
export class AgentService {
  constructor(
    @InjectModel(Agent_Data.name) private agentDataModel: Model<Agent_Data>,
    @InjectModel(Agent.name) private agentModel: Model<Agent>,
    @InjectModel(Group.name) private groupModel: Model<Group>,
    @InjectModel(Team.name) private teamModel: Model<Agent>,
    @InjectModel(Member.name) private memberModel: Model<Member>,
    private readonly userService: UserService,
  ) {}

  async nowDate() {
    return new Date(moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'))
  }

  async fullName(_id: Types.ObjectId) {
    const user = await this.userService.getUserById(_id);
    return user.data.name. firstName + ' ' + user.data.name.lastName;
  }

  async recentData(key: string, limit: number) {
    const log = await this.agentDataModel
      .find({ key: key })
      .sort({ 'data.Timestamp': 1 })
      .limit(limit)
      .exec();

    return log.map((log) => {
      return {
        data: log.data,
      }
    });
  }

  async getAgentsByTeamId(teamId: Types.ObjectId, userId: Types.ObjectId) {
    const team = await this.teamModel.findById(teamId);
    if (!team) {
      return {
        success: false,
        data: {
          message: 'Team not found'
        }
      }
    }

    const member = await this.memberModel.findOne({ userId: userId, teamId: teamId });
    if (!member) {
      return {
        success: false,
        data: {
          message: 'User is not a member of this team'
        }
      }
    }

    const group = await this.groupModel.findOne({ teamId: teamId });

    const agentIds = group.agents.map((agentId) => {
      return agentId.toString();
    })

    return this.agentModel.find({ _id: { $in: agentIds } })
  }

  async createAgent(teamId: Types.ObjectId, userId: Types.ObjectId, name: string) {
    const team = await this.teamModel.findById(teamId);
    if (!team) {
      return {
        success: false,
        data: {
          message: 'Team not found'
        }
      }
    }

    const group = await this.groupModel.findOne({ teamId: teamId });

    const nowDate = await this.nowDate();
    const fullName = await this.fullName(userId);

    const agent = new this.agentModel({
      groupId: group._id,
      name: name,
      key: randomValue(),
      account: randomValue(),
      lastUpdatedAt: nowDate,
      lastUpdatedBy: fullName,
    });

    group.agents.push(agent._id);

    await agent.save();
    await group.save();

    return {
      success: true,
      data: {
        message: 'Agent created successfully',
      }
    }
  }

  async updateAgent(teamId: Types.ObjectId, agentId: Types.ObjectId, userId: Types.ObjectId, name: string) {
    const team = await this.teamModel.findById(teamId);
    if (!team) {
      return {
        success: false,
        data: {
          message: 'Team not found'
        }
      }
    }

    const member = await this.memberModel.findOne({ userId: userId, teamId: teamId });
    if (!member) {
      return {
        success: false,
        data: {
          message: 'User is not a member of this team'
        }
      }
    }

    const group = await this.groupModel.findOne({ teamId: teamId });
    const groupId = group._id;

    const agent = await this.agentModel.findById(agentId);
    if (!agent) {
      return {
        success: false,
        data: {
          message: 'Agent not found'
        }
      }
    }

    if (agent.groupId.toString() !== groupId.toString()) {
      return {
        success: false,
        data: {
          message: 'Agent not found in this team'
        }
      }
    }

    //update agent
    const nowDate = await this.nowDate();
    const fullName = await this.fullName(userId);

    agent.name = name;
    agent.lastUpdatedAt = nowDate;
    agent.lastUpdatedBy = fullName;

    await agent.save();

    return {
      success: true,
      data: {
        message: 'Agent updated successfully',
      }
    }
  }

  async deleteAgent(teamId: Types.ObjectId, agentId: Types.ObjectId, userId: Types.ObjectId) {
    const team = await this.teamModel.findById(teamId);
    if (!team) {
      return {
        success: false,
        data: {
          message: 'Team not found'
        }
      }
    }

    const member = await this.memberModel.findOne({ userId: userId, teamId: teamId });
    if (!member) {
      return {
        success: false,
        data: {
          message: 'User is not a member of this team'
        }
      }
    }

    const group = await this.groupModel.findOne({ teamId: teamId });
    const groupId = group._id;

    const agent = await this.agentModel.findById(agentId);
    if (!agent) {
      return {
        success: false,
        data: {
          message: 'Agent not found'
        }
      }
    }

    if (agent.groupId.toString() !== groupId.toString()) {
      return {
        success: false,
        data: {
          message: 'Agent not found in this team'
        }
      }
    }

    //delete agents from group
    group.agents = group.agents.filter((agentId) => {
      return agentId.toString() !== agent._id.toString();
    })
    await group.save();

    //delete agent
    await this.agentModel.deleteOne({ _id: agentId });

    return {
      success: true,
      data: {
        message: 'Agent deleted successfully',
      }
    }

  }
}
