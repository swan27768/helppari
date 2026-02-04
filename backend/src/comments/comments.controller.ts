import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommentsService } from './comments.service';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get(':postId')
  getForPost(@Param('postId') postId: string) {
    return this.commentsService.getForPost(Number(postId));
  }

  @Post()
  create(@Request() req: any, @Body() body: { postId: number; body: string }) {
    return this.commentsService.create(req.user.userId, body.postId, body.body);
  }
}
