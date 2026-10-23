import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class UpdatePhoneDto {
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/^\+?[0-9\s().-]+$/, {
    message: "phoneNumber must be a valid WhatsApp phone number",
  })
  phoneNumber!: string;
}
