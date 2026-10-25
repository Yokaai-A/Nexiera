import { IsIn } from "class-validator";

export class ReviewAdDto {
  @IsIn(["APPROVE", "REJECT"])
  decision!: "APPROVE" | "REJECT";
}
