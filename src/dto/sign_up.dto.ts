import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto {

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  team: string;

  @IsString()
  plan: string;

}


