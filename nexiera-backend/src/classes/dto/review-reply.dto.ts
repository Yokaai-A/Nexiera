import { IsString, MaxLength, MinLength } from "class-validator";

export class ReviewReplyDto {
  @IsString()
  @MinLength(1)
  @MaxLength(3000)
  reply!: string;
}
