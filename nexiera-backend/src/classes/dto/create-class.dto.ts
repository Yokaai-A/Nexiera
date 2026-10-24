import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
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
  @IsEnum(ClassType)
  type?: ClassType;

  @IsOptional()
  @IsEnum(TutorGrade)
  tutorGrade?: TutorGrade;

  // Backward compatibility alias
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

  // Backward compatibility alias
  @IsOptional()
  @IsString()
  mainCategory?: string;

  @IsOptional()
  @IsString()
  campusTarget?: string;

  // Backward compatibility alias
  @IsOptional()
  @IsString()
  university?: string;

  @IsString()
  @MinLength(1)
  bannerUrl!: string;

  @IsOptional()
  @IsString()
  meetingLink?: string;

  // Backward compatibility alias
  @IsOptional()
  @IsString()
  meetingUrl?: string;

  @IsOptional()
  @IsString()
  materialLink?: string;

  // Backward compatibility alias
  @IsOptional()
  @IsString()
  materialUrl?: string;

  @IsOptional()
  @IsString()
  recordingLink?: string;

  // Backward compatibility alias
  @IsOptional()
  @IsString()
  recordingUrl?: string;

  @IsOptional()
  @IsArray()
  tutors?: BootcampTutorDto[];

  @IsOptional()
  @IsDateString()
  startsAt?: string;
}
