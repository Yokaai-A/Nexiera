import { IsEmail, MaxLength } from "class-validator";

export class ResendVerificationDto {
  @IsEmail()
  @MaxLength(191)
  email!: string;
}
