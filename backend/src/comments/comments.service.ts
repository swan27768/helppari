import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  // 🔹 Hae kommentit postaukselle
  async getForPost(postId: number) {
    return this.prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: { firstName: true },
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
}
