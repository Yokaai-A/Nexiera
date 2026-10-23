import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { CompleteManualRefundDto } from "./dto/complete-manual-refund.dto.js";
import { CreateTransactionDto } from "./dto/create-transaction.dto.js";
import { parseMidtransNotification } from "./dto/midtrans-notification.dto.js";
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

  @Post("webhook/midtrans")
  @HttpCode(HttpStatus.OK)
  async handleMidtransWebhook(@Body() body: unknown) {
    const notification = parseMidtransNotification(body);
    if (!this.transactionsService.verifyNotificationSignature(notification)) {
      throw new UnauthorizedException("Invalid Midtrans signature");
    }
    return this.transactionsService.handleMidtransNotification(notification);
  }

  @Get("refunds/manual-required")
  @UseGuards(JwtAuthGuard)
  listManualRefunds(@Req() request: AuthenticatedRequest) {
    return this.transactionsService.listManualRefunds(request.user.userId);
  }

  @Patch(":transactionId/refund/manual-complete")
  @UseGuards(JwtAuthGuard)
  completeManualRefund(
    @Param("transactionId") transactionId: string,
    @Req() request: AuthenticatedRequest,
    @Body() body: CompleteManualRefundDto,
  ) {
    return this.transactionsService.completeManualRefund(
      transactionId,
      request.user.userId,
      body.transferReference,
    );
  }
}
