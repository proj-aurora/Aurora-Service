import {Body, Controller, Param, Post} from '@nestjs/common';
import { SignUpDto } from '../dto/sign_up.dto';
import { SignService } from './sign.service';
import { SignInDto } from "../dto/sign_in.dto";
import {MessagePattern} from "@nestjs/microservices";

@Controller('sign')
export class SignController {
  constructor(private readonly signService: SignService) {}

  @MessagePattern({ check: 'sign_up' })
  async sign_up(@Body() userDto: SignUpDto) {
    return this.signService.sign_up(userDto);
  }

  //@Post('sign_in)
  @MessagePattern({ check: 'sign_in' })
  async sign_in(@Body() signInDto: SignInDto) {
    return this.signService.sign_in(signInDto);
  }
}