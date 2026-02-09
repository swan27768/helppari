import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  // 🔓 FEED (julkinen)
  @Get()
  getFeed(@Query('cursor') cursor?: string) {
    return this.postsService.getFeed(cursor);
  }

  // 🔒 LUO POST
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Request() req: any,
    @Body() body: { title: string; body: string; type: string },
  ) {
    return this.postsService.createPost(
      req.user.userId,
      body.title,
      body.body,
      body.type,
    );
  }

  // 🔒 POISTA POST
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.postsService.deletePost(Number(id), req.user);
  }
}
