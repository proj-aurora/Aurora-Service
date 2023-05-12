import { Body, Controller, Post } from '@nestjs/common';
import { Sign_upDto } from '../dto/sign_up.dto';
import { SignService } from './sign.service';
import { Sign_inDto } from "../dto/sign_in.dto";

@Controller('sign')
export class SignController {
  constructor(private readonly signService: SignService) {}

  @Post('sign_up')
  async sign_up(@Body() userDto: Sign_upDto) {
    return this.signService.sign_up(userDto);
  }

  @Post('sign_in')
  async sign_in(@Body() signInDto: Sign_inDto) {
    return this.signService.sign_in(signInDto);
  }
}