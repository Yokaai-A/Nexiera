import { IsDateString, IsIn, IsString, MaxLength, MinLength } from "class-validator";

export type AdPlacementType = "HOME_HERO" | "SIDE_MARGIN";

export class CreateAdDto {
  @IsString()
  @MinLength(3)
  @MaxLength(191)
  title!: string;

  @IsString()
  @MaxLength(2000)
  subtitle!: string;

  @IsIn(["HOME_HERO", "SIDE_MARGIN"])
  placement!: AdPlacementType;

  @IsString()
  imageUrl!: string;

  @IsString()
  targetUrl!: string;

  @IsDateString()
  startsAt!: string;

  @IsDateString()
  endsAt!: string;
}
