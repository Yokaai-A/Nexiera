import { IsIn } from "class-validator";

export class ReviewTutorApplicationDto {
  @IsIn(["APPROVED", "REJECTED"])
  status!: "APPROVED" | "REJECTED";
}
