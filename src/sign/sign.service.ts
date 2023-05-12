import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../mongo/user.entity';
import { pollute, polluteVeil } from '../utils/crypto.utils';
import { Sign_upDto } from "../dto/sign_up.dto";
import { Sign_inDto } from "../dto/sign_in.dto";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SignService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async sign_up(user: Sign_upDto) {

    // The 'polluted Veil' serves as a veil of atmospheric pollution that obscures the light of the Aurora,
    // symbolizing this pollutant(salt) 'pollutes' the data to conceal its original value.

    // todo create a salt
    const pollutant = pollute();

    // todo  create a hashed password
    const pollutedVeil = polluteVeil(user.password, pollutant);

    // The 'brighterAurora' signifies the intensification of light within the Aurora,
    // illustrating the enhancement of our system with the addition of a new user.

    // todo create new user
    const brighterAurora = new this.userModel({
      ...user,
      salt: pollutant,
      password: pollutedVeil,
    });

    return brighterAurora.save();
  }

  async sign_in(user: Sign_inDto) {
    const foundUser = await this.userModel.findOne({ email: user.email });
    if (!foundUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const hashedPassword = polluteVeil(user.password, foundUser.salt);
    if (hashedPassword !== foundUser.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: foundUser.email, sub: foundUser._id };
    return {
      access_token: this.jwtService.sign(payload),
    };

  }
}
