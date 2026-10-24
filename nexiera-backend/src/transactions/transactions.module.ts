import { Module } from "@nestjs/common";
import { NotificationsModule } from "../notifications/notifications.module.js";
import { AdminGuard } from "../auth/admin.guard.js";
import { TransactionsController } from "./transactions.controller.js";
import { MidtransService } from "./midtrans.service.js";
import { TransactionsService } from "./transactions.service.js";

@Module({
  imports: [NotificationsModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, MidtransService, AdminGuard],
  exports: [TransactionsService],
})
export class TransactionsModule {}
