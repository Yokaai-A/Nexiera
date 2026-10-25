import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
  MinLength,
} from "class-validator";
import { ClassType, TutorGrade } from "../../generated/prisma/client.js";
import { BootcampTutorDto } from "./create-class.dto.js";

export class UpdateClassDto {
  @IsOptional() @IsString() @MinLength(3) title?: string;
  @IsOptional() @IsString() shortDescription?: string;
  @IsOptional() @IsString() @MinLength(10) description?: string;
  @IsOptional() @IsEnum(ClassType) type?: ClassType;
  @IsOptional() @IsEnum(TutorGrade) tutorGrade?: TutorGrade;
  @IsOptional() @IsString() courseType?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() major?: string;
  @IsOptional() @IsString() mainCategory?: string;
  @IsOptional() @IsString() campusTarget?: string;
  @IsOptional() @IsString() university?: string;
  @IsOptional() @IsString() bannerUrl?: string;
  @IsOptional() @IsNumber() @Min(0) price?: number;
  @IsOptional() @IsString() meetingLink?: string;
  @IsOptional() @IsString() meetingUrl?: string;
  @IsOptional() @IsString() materialLink?: string;
  @IsOptional() @IsString() materialUrl?: string;
  @IsOptional() @IsString() recordingLink?: string;
  @IsOptional() @IsString() recordingUrl?: string;
  @IsOptional() @IsString() meetingPlatform?: string;
  @IsOptional() @IsString() materialPlatform?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) requirements?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) facilities?: string[];
  @IsOptional() @IsArray() tutors?: BootcampTutorDto[];
  @IsOptional() @IsDateString() startsAt?: string;
  @IsOptional() @IsString() accessDuration?: string;
  @IsOptional() @IsDateString() accessUntil?: string;
  @IsOptional() @IsNumber() @Min(1) @Max(200) maxQuota?: number;
}
