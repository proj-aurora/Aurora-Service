import {Prop, raw, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose, {HydratedDocument, Types} from 'mongoose';

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

  @Prop([{ type: Types.ObjectId, ref: 'Team' }])
  team: Types.ObjectId[];

}

export const UserSchema = SchemaFactory.createForClass(User);