import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {

  @IsEmail()
  @IsNotEmpty()
  public readonly email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

}