import { Module } from "@nestjs/common";
import { NotificationsModule } from "../notifications/notifications.module.js";
import { AdminGuard } from "../auth/admin.guard.js";
import { ClassesController } from "./classes.controller.js";
import { ClassesService } from "./classes.service.js";

@Module({
  imports: [NotificationsModule],
  controllers: [ClassesController],
  providers: [ClassesService, AdminGuard],
  exports: [ClassesService],
})
export class ClassesModule {}
