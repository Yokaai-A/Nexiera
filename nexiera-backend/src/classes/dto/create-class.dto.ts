import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  Max,
  MinLength,
} from "class-validator";
import { ClassType, TutorGrade } from "../../generated/prisma/client.js";

export class BootcampTutorDto {
  @IsString()
  name!: string;

  @IsString()
  roleTitle!: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  headline?: string;

  @IsOptional()
  @IsString()
  linkedinUrl?: string;
}

export class CreateClassDto {
  @IsString()
  @MinLength(3)
  title!: string;

  @IsString()
  @MinLength(10)
  description!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  shortDescription?: string;

  @IsOptional()
  @IsEnum(ClassType)
  type?: ClassType;

  @IsOptional()
  @IsEnum(TutorGrade)
  tutorGrade?: TutorGrade;


  @IsOptional()
  @IsString()
  courseType?: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  major?: string;


  @IsOptional()
  @IsString()
  mainCategory?: string;

  @IsOptional()
  @IsString()
  campusTarget?: string;


  @IsOptional()
  @IsString()
  university?: string;

  @IsString()
  @MinLength(1)
  bannerUrl!: string;

  @IsOptional()
  @IsString()
  meetingLink?: string;


  @IsOptional()
  @IsString()
  meetingUrl?: string;

  @IsOptional()
  @IsString()
  materialLink?: string;


  @IsOptional()
  @IsString()
  materialUrl?: string;

  @IsOptional()
  @IsString()
  recordingLink?: string;


  @IsOptional()
  @IsString()
  recordingUrl?: string;

  @IsOptional()
  @IsString()
  meetingPlatform?: string;

  @IsOptional()
  @IsString()
  materialPlatform?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  facilities?: string[];

  @IsOptional()
  @IsArray()
  tutors?: BootcampTutorDto[];

  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @IsOptional()
  @IsString()
  accessDuration?: string;

  @IsDateString()
  accessUntil!: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(200)
  maxQuota?: number;
}
