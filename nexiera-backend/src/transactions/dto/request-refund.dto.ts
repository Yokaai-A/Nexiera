import { IsIn, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class RequestRefundDto {
  @IsIn(["BANK", "EWALLET"])
  method!: "BANK" | "EWALLET";

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  accountName!: string;

  @IsString()
  @MinLength(5)
  @MaxLength(64)
  accountNumber!: string;
}

export class ReviewRefundDto {
  @IsIn(["APPROVE", "REJECT"])
  decision!: "APPROVE" | "REJECT";

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  proofUrl?: string;
}
