import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Patch,
  Param,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { AdminGuard } from "../auth/admin.guard.js";
import { CreateTransactionDto } from "./dto/create-transaction.dto.js";
import { RequestRefundDto, ReviewRefundDto } from "./dto/request-refund.dto.js";
import { TransactionsService } from "./transactions.service.js";

type AuthenticatedRequest = Request & { user: { userId: string } };

@Controller("transactions")
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createCheckout(
    @Req() request: AuthenticatedRequest,
    @Body() body: CreateTransactionDto,
  ) {
    return this.transactionsService.createCheckout(request.user.userId, body.classId);
  }

  @Get("mine")
  @UseGuards(JwtAuthGuard)
  listMine(@Req() request: AuthenticatedRequest) {
    return this.transactionsService.listMine(request.user.userId);
  }

  @Post(":transactionId/refund")
  @UseGuards(JwtAuthGuard)
  requestRefund(@Req() request: AuthenticatedRequest, @Param("transactionId") id: string, @Body() body: RequestRefundDto) {
    return this.transactionsService.requestRefund(request.user.userId, id, body);
  }

  @Patch(":transactionId/refund/review")
  @UseGuards(JwtAuthGuard, AdminGuard)
  reviewRefund(@Req() request: AuthenticatedRequest, @Param("transactionId") id: string, @Body() body: ReviewRefundDto) {
    return this.transactionsService.reviewRefund(request.user.userId, id, body.decision, body.note, body.proofUrl);
  }

  @Get("admin/refunds")
  @UseGuards(JwtAuthGuard, AdminGuard)
  listPendingRefunds() {
    return this.transactionsService.listPendingRefunds();
  }

  @Post("webhook/midtrans")
  @HttpCode(HttpStatus.OK)
  handleMidtransWebhook(@Body() body: Record<string, unknown>) {
    return this.transactionsService.handleMidtransWebhook(body);
  }
}
