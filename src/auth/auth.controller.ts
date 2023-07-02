import {Body, Controller, Post} from "@nestjs/common";
import * as uuid from 'uuid';
import {EmailService} from "./email.service";

@Controller('auth')
export class AuthController {
  constructor(private readonly emailService: EmailService) {}
  @Post('email')
  async sendEmail(@Body() body: { email: string }) {
    const signupVerifyToken = uuid.v1()
    const email = body.email;
    return await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
  }
}