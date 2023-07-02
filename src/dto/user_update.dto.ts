import { IsString } from 'class-validator';
export class UserUpdateDto {
  @IsString()
  readonly plan: string;

  @IsString()
  readonly country: string;
}