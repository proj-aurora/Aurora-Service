import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TeamDocument = Team & Document;

@Schema()
export class Team {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  registrationCode: string;

  @Prop([{ type: Types.ObjectId, ref: 'Member' }])
  members: Types.ObjectId[];

  @Prop([{ type: Types.ObjectId, ref: 'Group' }])
  group: Types.ObjectId[];

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  owner: string;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
