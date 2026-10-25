import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";

export class ReviewClassDto {
  @IsIn(["APPROVE", "REJECT"])
  decision!: "APPROVE" | "REJECT";

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;
}
