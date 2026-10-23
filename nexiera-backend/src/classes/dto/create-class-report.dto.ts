import { IsIn, IsString, MaxLength, MinLength } from "class-validator";

const REPORT_CATEGORIES = [
  "tutor_tidak_hadir",
  "materi_tidak_sesuai",
  "indikasi_penipuan",
  "pelanggaran_etika",
  "lainnya",
] as const;

export class CreateClassReportDto {
  @IsIn(["CLASS", "ORGANIZER"])
  targetType!: "CLASS" | "ORGANIZER";

  @IsString()
  @MinLength(1)
  @MaxLength(191)
  targetId!: string;

  @IsIn(REPORT_CATEGORIES)
  category!: (typeof REPORT_CATEGORIES)[number];

  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  description!: string;
}
