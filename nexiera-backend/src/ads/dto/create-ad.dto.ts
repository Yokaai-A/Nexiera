import { IsDateString, IsEnum, IsString, IsUrl, MaxLength, MinLength } from "class-validator";
import { AdPlacement } from "../../generated/prisma/client.js";

export class CreateAdDto {
  @IsString()
  @MinLength(3)
  @MaxLength(191)
  title!: string;

  @IsString()
  @MaxLength(2000)
  subtitle!: string;

  @IsEnum(AdPlacement)
  placement!: AdPlacement;

  @IsUrl({ require_protocol: true })
  imageUrl!: string;

  @IsUrl({ require_protocol: true })
  targetUrl!: string;

  @IsDateString()
  startsAt!: string;

  @IsDateString()
  endsAt!: string;
}
