import { IsIn, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";

export class SubmitTutorApplicationDto {
  @IsIn(["PEER_TUTOR", "BOOTCAMP_PARTNER"])
  type!: "PEER_TUTOR" | "BOOTCAMP_PARTNER";

  @IsOptional() @IsString() @MaxLength(191)
  organizationName?: string;

  @IsOptional() @IsString() @MaxLength(191)
  contactPerson?: string;

  @IsOptional() @IsUrl({ require_protocol: true })
  studentCardUrl?: string;

  @IsOptional() @IsUrl({ require_protocol: true })
  transcriptUrl?: string;

  @IsOptional() @IsUrl({ require_protocol: true })
  organizationProofUrl?: string;

  @IsOptional() @IsString() @MinLength(20) @MaxLength(5000)
  notes?: string;
}
