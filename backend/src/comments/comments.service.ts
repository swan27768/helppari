import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  // 🔹 Hae kommentit postaukselle
  async getForPost(postId: number) {
    return this.prisma.comment.findMany({
      where: {
        postId,
      },
      orderBy: {
        createdAt: 'desc', // 🔑 uusin ensin → näkyy heti
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
          },
        },
      },
    });
  }

  // 🔹 Luo uusi kommentti
  async create(userId: number, postId: number, body: string) {
    return this.prisma.comment.create({
      data: {
        body,
        userId,
        postId,
      },
    });
  }
  async deleteComment(
    commentId: number,
    user: { userId: number; role: string },
  ) {
    if (!commentId) {
      throw new NotFoundException('Comment id missing');
    }

    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    // 🔑 PUUTTUVA TARKISTUS
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const isOwner = comment.userId === user.userId;
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Not allowed to delete this comment');
    }

    return this.prisma.comment.delete({
      where: { id: commentId },
    });
  }
}
