import {Prop, raw, Schema, SchemaFactory} from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  salt: string; 

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop(raw({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
  }))
  name: {
    firstName: string;
    lastName: string;
  };

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  group: string;

  @Prop({ required: true })
  plan: string;

}

export const UserSchema = SchemaFactory.createForClass(User);