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
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Query } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  async create(
    @Request() req: any,
    @Body()
    body: {
      title: string;
      body: string;
      type: string;
    },
  ) {
    return this.postsService.createPost(
      req.user.userId,
      body.title,
      body.body,
      body.type,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Request() req: any,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    return this.postsService.getFeed({
      userId: req.user.userId,
      limit: limit ? Number(limit) : 10,
      cursor,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.postsService.deletePost(Number(id), {
      userId: req.user.userId,
      role: req.user.role,
    });
  }
}
