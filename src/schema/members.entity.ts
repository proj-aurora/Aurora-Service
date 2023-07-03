import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Member {
  @Prop({ required: true })
  teamId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true, default: 'owner' }) // owner로 초기값 설정
  permission: string;

  @Prop({ required: true })
  lastUpdatedAt: Date;

  @Prop({ required: true })
  lastUpdatedBy: string;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
