import { Module } from "@nestjs/common";
import { PresencesController } from "./presences.controller.js";
import { PresencesService } from "./presences.service.js";

@Module({
  controllers: [PresencesController],
  providers: [PresencesService],
})
export class PresencesModule {}
