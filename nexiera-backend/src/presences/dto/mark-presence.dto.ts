import { IsEnum } from "class-validator";
import { PresenceStatus } from "../../generated/prisma/client.js";

export class MarkPresenceDto {
  @IsEnum(PresenceStatus)
  status!: PresenceStatus;
}
