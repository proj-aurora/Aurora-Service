import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class Sign_inDto {

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

}
