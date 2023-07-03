import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schema/user.entity';
import { pollute, polluteVeil } from '../../utils/crypto.utils';
import { SignUpDto } from "../dto/sign_up.dto";
import { SignInDto } from "../dto/sign_in.dto";
import { JwtService } from '@nestjs/jwt';
import {AsyncResponseBody} from "../model/ResponseBody";

@Injectable()
export class SignService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async sign_up(user: SignUpDto): AsyncResponseBody<object> {
    try {

      await this.existingUser(user)

      // The 'polluted Veil' serves as a veil of atmospheric pollution that obscures the light of the Aurora,
      // symbolizing this pollutant(salt) 'pollutes' the data to conceal its original value.

      // todo create a salt
      const pollutant = pollute();

      // todo  create a hashed password
      const pollutedVeil = polluteVeil(user.password, pollutant);

      // The 'brighterAurora' signifies the intensification of light within the Aurora,
      // illustrating the enhancement of our system with the addition of a new user.

      // todo create new user
      const name = {firstName: user.firstName, lastName: user.lastName};
      const brighterAurora = new this.userModel({
        ...user,
        name: name,
        salt: pollutant,
        password: pollutedVeil,
      });

      const savedUser = await brighterAurora.save();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {password, salt, phone, __v, ...userData} = savedUser.toObject();

      return {
        success: true,
        data: {
          statusCode: HttpStatus.CREATED,
          message: 'User created successfully',
        }
      };
    } catch (error) {
      if (error instanceof HttpException) {
        return {
          success: false,
          data: {
            statusCode: HttpStatus.CONFLICT,
            message: 'Email or phone number already exists'
          }
        }
      } else {
        console.log(error)
        return {
          success: false,
          data: {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error
          }
        }
      }
    }
  }

  async existingUser(user: SignUpDto) {
    const existingUser = await this.userModel.findOne({ $or: [{ email: user.email }, { phone: user.phone }] });
    if (existingUser) {
      throw new HttpException('Email or phone number already exists', HttpStatus.CONFLICT);
    }
  }

  // todo modify variable names with concepts from the Aurora
  async sign_in(user: SignInDto){
    // todo user authentication
    const foundUser = await this.userModel.findOne({ email: user.email });
    if (!foundUser || this.checkPassword(user, foundUser)) {
      return {
        success: false,
        data: {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid credentials',
        }
      }
      // throw new UnauthorizedException('Invalid credentials');
    }

    // todo create access token
    const access_token = this.jwtService.sign({ email: foundUser.email, sub: foundUser._id })

    return {
      success: true,
      data: {access_token},
    };
  }

  // todo check password
  checkPassword(user: SignInDto, foundUser: User): boolean {
    const pollutedVeil = polluteVeil(user.password, foundUser.salt)
    return pollutedVeil !== foundUser.password
  }
}
