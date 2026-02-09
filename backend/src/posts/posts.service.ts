import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  // 🔹 CREATE
  async createPost(userId: number, title: string, body: string, type: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.post.create({
      data: {
        title,
        body,
        type,
        userId: user.id,
        neighbourhoodId: user.neighbourhoodId,
        status: 'active',
      },
    });
  }

  // 🔹 SOFT DELETE
  async deletePost(postId: number, user: { userId: number; role: string }) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const isOwner = post.userId === user.userId;
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You are not allowed to delete this post');
    }

    return this.prisma.post.update({
      where: { id: postId },
      data: { status: 'deleted' },
    });
  }

  // 🔹 FEED (cursor-pagination)
  async getFeed(cursor?: string, limit = 10) {
    const posts = await this.prisma.post.findMany({
      where: {
        status: { not: 'deleted' },
        ...(cursor && {
          createdAt: {
            lt: new Date(cursor),
          },
        }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit + 1,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
          },
        },
      },
    });

    let nextCursor: string | null = null;

    if (posts.length > limit) {
      const nextItem = posts.pop();
      nextCursor = nextItem!.createdAt.toISOString();
    }

    return {
      items: posts,
      nextCursor,
    };
  }
}
