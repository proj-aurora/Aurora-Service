import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from "mongoose";

export type AgentDataDocument = HydratedDocument<Agent_Data>;

@Schema()
export class Agent_Data {
  @Prop()
  key: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  data: object;

  @Prop()
  datetime: Date;

  @Prop()
  tag: string;
}

export const AgentDataSchema = SchemaFactory.createForClass(Agent_Data);
