import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

@Schema()
export class Agent {

  @Prop({ required: true })
  id: string;

  @Prop({ required: true, default: 'Default Agent' })
  name: string;

  @Prop({ required: true })
  lastUpdatedAt: Date;

  @Prop({ required: true })
  lastUpdatedBy: string;

  @Prop({ required: true, default: 'off' })
  status: string;
}

export const AgentSchema = SchemaFactory.createForClass(Agent);