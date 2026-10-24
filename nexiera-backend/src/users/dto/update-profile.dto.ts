import { IsEmail, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(191)
  fullName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(191)
  name?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(191)
  campus?: string;

  @IsOptional()
  @IsString()
  @MaxLength(191)
  university?: string;

  @IsOptional()
  @IsString()
  @MaxLength(191)
  major?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  studentNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  semester?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @IsOptional()
  @IsString()
  coverUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  bio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(191)
  headline?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  organizationName?: string;

  @IsOptional()
  @IsString()
  organizationLogoUrl?: string;

  @IsOptional()
  @IsString()
  location?: string;
}
