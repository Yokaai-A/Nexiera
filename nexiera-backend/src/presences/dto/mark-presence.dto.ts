import { IsIn, IsString } from "class-validator";

export class MarkPresenceDto {
  @IsString()
  @IsIn(["PRESENT", "ABSENT", "LATE"])
  status!: string;
}
