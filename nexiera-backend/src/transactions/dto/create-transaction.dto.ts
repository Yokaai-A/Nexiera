import { IsString, MinLength } from "class-validator";

export class CreateTransactionDto {
  @IsString()
  @MinLength(1)
  classId!: string;
}
