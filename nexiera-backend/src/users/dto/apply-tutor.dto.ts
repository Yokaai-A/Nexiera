import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";

export class ApplyTutorDto {


  @IsOptional() @IsIn(["TUTOR", "PEER_TUTOR", "tutor", "peer_tutor"])
  role?: string;
  @IsString() @MaxLength(191) campus!: string;
  @IsString() @MaxLength(191) major!: string;
  @IsString() @MaxLength(2048) studentProofUrl!: string;
  @IsOptional() @IsString() @MaxLength(5000) notes?: string;
}
