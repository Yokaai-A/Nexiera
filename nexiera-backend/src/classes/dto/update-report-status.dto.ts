import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateReportStatusDto {
  @IsIn(["UNDER_REVIEW", "RESOLVED", "DISMISSED"])
  status!: "UNDER_REVIEW" | "RESOLVED" | "DISMISSED";
  @IsOptional() @IsString() @MaxLength(2000)
  note?: string;
}
