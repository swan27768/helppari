import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommentsService } from './comments.service';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  // 🔓 JULKINEN – kommenttien luku ei vaadi loginia
  @Get()
  getForPost(@Param('postId') postId: string) {
    return this.commentsService.getForPost(Number(postId));
  }

  // 🔒 KOMMENTIN LUONTI → vaatii loginin
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Request() req: any,
    @Param('postId') postId: string,
    @Body() body: { body: string },
  ) {
    return this.commentsService.create(
      req.user.userId,
      Number(postId),
      body.body,
    );
  }

  // 🔒 KOMMENTIN POISTO → vaatii loginin
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @Request() req: any) {
    return this.commentsService.deleteComment(Number(id), req.user);
  }
}
