import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Group {
  @Prop({ required: true })
  teamId: string;

  @Prop({ required: true, default: 'Default Group' }) // 'agent'로 초기값 설정
  name: string;

  @Prop([{ type: Types.ObjectId, ref: 'Agent', unique: true }])
  agents: Types.ObjectId[];

  @Prop({ required: true })
  lastUpdatedAt: Date;

  @Prop({ required: true })
  lastUpdatedBy: string;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
