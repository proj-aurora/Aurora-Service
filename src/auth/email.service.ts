import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: configService.get('GOOGLE_EMAIL'),
        pass: configService.get('GOOGLE_PASSWORD'),
      },
    });
  }

  async sendMemberJoinVerification(
    emailAddress: string,
    signupVerifyToken: string,
  ) {
    const baseUrl = 'http://localhost:5000';

    const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;

    // HTML 파일 읽기
    const filePath = path.resolve(__dirname, '../utils/team.email.html');
    console.log(filePath);
    const html = fs.readFileSync(filePath, 'utf-8');
    console.log(html);

    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: 'Aurora',
      html: html,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
