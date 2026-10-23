import {
  IsArray,
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import { CourseType } from "../../generated/prisma/client.js";

export class UpdateClassDto {
  @IsOptional() @IsString() @MinLength(3) @MaxLength(191) title?: string;
  @IsOptional() @IsString() @MaxLength(191) shortDescription?: string;
  @IsOptional() @IsString() @MinLength(10) description?: string;
  @IsOptional() @IsString() @MaxLength(191) mainCategory?: string;
  @IsOptional() @IsString() @MaxLength(191) major?: string;
  @IsOptional() @IsString() @MaxLength(191) university?: string;
  @IsOptional() @IsEnum(CourseType) courseType?: CourseType;
  @IsOptional() @IsString() @MaxLength(191) organizerName?: string;
  @IsOptional() @IsUrl({ require_protocol: true }) organizerLogo?: string;
  @IsOptional() @IsInt() @Min(0) @Max(9_999_999_999) price?: number;
  @IsOptional() @IsDateString() startsAt?: string;
  @IsOptional() @IsString() @MaxLength(191) accessDuration?: string;
  @IsOptional() @IsInt() @Min(1) @Max(10000) maxQuota?: number;
  @IsOptional() @IsArray() @IsString({ each: true }) requirements?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) facilities?: string[];
  @IsOptional() @IsIn(["ZOOM", "GMEET", "DISCORD"]) meetingPlatform?: string;
  @IsOptional() @IsUrl({ require_protocol: true }) meetingUrl?: string;
  @IsOptional() @IsIn(["NOTION", "DRIVE", "PDF", "GITHUB"]) materialPlatform?: string;
  @IsOptional() @IsUrl({ require_protocol: true }) materialUrl?: string;
  @IsOptional() @IsUrl({ require_protocol: true }) recordingUrl?: string;
  @IsOptional() @IsUrl({ require_protocol: true }) driveUrl?: string;
}
