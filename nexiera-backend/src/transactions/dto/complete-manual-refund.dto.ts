import { IsString, MaxLength, MinLength } from "class-validator";

export class CompleteManualRefundDto {
  @IsString()
  @MinLength(3)
  @MaxLength(191)
  transferReference!: string;
}
