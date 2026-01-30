import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

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
      },
    });
  }

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
      data: { status: 'deleted' }, // ⭐ SOFT DELETE
    });
  }

  async getPostsForUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.prisma.post.findMany({
      where: {
        neighbourhoodId: user.neighbourhoodId,
        status: { not: 'deleted' }, // ⭐ TÄRKEÄ
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { firstName: true } },
      },
    });
  }
  async getFeed(params: { userId: number; limit: number; cursor?: string }) {
    const { userId, limit, cursor } = params;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const posts = await this.prisma.post.findMany({
      where: {
        neighbourhoodId: user.neighbourhoodId,
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
          select: { firstName: true },
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
