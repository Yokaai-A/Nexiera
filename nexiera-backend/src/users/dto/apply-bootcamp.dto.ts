import { IsEmail, IsOptional, IsString, MaxLength } from "class-validator";

export class ApplyBootcampDto {
  @IsString() @MaxLength(191) organizationName!: string;
  @IsEmail() @MaxLength(191) contactEmail!: string;
  @IsString() @MaxLength(2048) logoUrl!: string;
  @IsOptional() @IsString() @MaxLength(2048) websiteUrl?: string;
  @IsString() @MaxLength(2048) studentProofUrl!: string;
  @IsString() @MaxLength(5000) description!: string;
}
