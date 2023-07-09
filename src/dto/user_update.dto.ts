import { IsString } from 'class-validator';
export class UserUpdateDto {
  @IsString()
  readonly country: string;

  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsString()
  readonly currentPW: string;
}