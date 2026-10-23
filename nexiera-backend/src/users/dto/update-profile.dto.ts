import { IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(191)
  name?: string;

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
  @IsUrl({ require_protocol: true })
  avatarUrl?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
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
  @MaxLength(191)
  organizationName?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  organizationLogoUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(191)
  location?: string;
}
