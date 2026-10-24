import { Module } from "@nestjs/common";
import { NotificationsModule } from "../notifications/notifications.module.js";
import { AdminGuard } from "../auth/admin.guard.js";
import { UsersController } from "./users.controller.js";
import { UsersService } from "./users.service.js";

@Module({
  imports: [NotificationsModule],
  controllers: [UsersController],
  providers: [UsersService, AdminGuard],
  exports: [UsersService],
})
export class UsersModule {}
