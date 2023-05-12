import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {

  // @Prop({ required: true })
  // id: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  salt: string; 

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  group: string;

  @Prop({ required: true })
  plan: string;

}

export const UserSchema = SchemaFactory.createForClass(User);