import { IsEmail, IsIn, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
  @IsEmail()
  @MaxLength(191)
  email!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(72)
  password!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(191)
  fullName!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/^\+?[0-9\s().-]+$/, { message: "phoneNumber must be a valid WhatsApp number" })
  phoneNumber!: string;

  @IsIn(["MAHASISWA", "STUDENT"])
  role: "MAHASISWA" | "STUDENT" = "MAHASISWA";
}
