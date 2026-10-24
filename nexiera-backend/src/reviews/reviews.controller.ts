import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { ReviewsService } from "./reviews.service.js";
import { IsInt, IsOptional, IsString, Max, Min, MinLength } from "class-validator";

class CreateReviewBody {
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsOptional()
  @IsString()
  comment?: string;
}

class ReplyReviewBody {
  @IsString()
  @MinLength(2)
  reply!: string;
}

type AuthenticatedRequest = Request & { user: { userId: string } };

@Controller("classes/:classId/reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  getReviews(@Param("classId") classId: string) {
    return this.reviewsService.getReviewsForClass(classId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createReview(
    @Param("classId") classId: string,
    @Req() request: AuthenticatedRequest,
    @Body() body: CreateReviewBody,
  ) {
    return this.reviewsService.createReview(
      classId,
      request.user.userId,
      body.rating,
      body.comment,
    );
  }

  @Patch(":reviewId/reply")
  @UseGuards(JwtAuthGuard)
  replyToReview(
    @Param("classId") classId: string,
    @Param("reviewId") reviewId: string,
    @Req() request: AuthenticatedRequest,
    @Body() body: ReplyReviewBody,
  ) {
    return this.reviewsService.replyToReview(
      classId,
      reviewId,
      body.reply,
      request.user.userId,
    );
  }
}
