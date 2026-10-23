import { Module } from "@nestjs/common";
import { TransactionsModule } from "../transactions/transactions.module.js";
import { ClassesController } from "./classes.controller.js";
import { ClassesService } from "./classes.service.js";

@Module({
  imports: [TransactionsModule],
  controllers: [ClassesController],
  providers: [ClassesService],
})
export class ClassesModule {}
