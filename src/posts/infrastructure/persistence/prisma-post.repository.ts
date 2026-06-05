import { Injectable } from "@nestjs/common"
import { PrismaService } from "@/shared/prisma.service"
import { IPostRepository } from "../../domain/repositories/post.repository.interface"
import { PostEntity, PostFeedEntity } from "../../domain/entities/post.entity"

@Injectable()
export class PrismaPostRepository implements IPostRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: {
        title: string
        description: string
        imageUrl: string
        categoryId?: string
    }): Promise<PostEntity> {
        const post = await this.prisma.post.create({ data })
        return new PostEntity({
            id: post.id,
            title: post.title,
            description: post.description,
            imageUrl: post.imageUrl,
            categoryId: post.categoryId,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        })
    }

    async findById(id: string): Promise<PostEntity | null> {
        const post = await this.prisma.post.findUnique({ where: { id } })
        if (!post) return null
        return new PostEntity({
            id: post.id,
            title: post.title,
            description: post.description,
            imageUrl: post.imageUrl,
            categoryId: post.categoryId,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        })
    }

    async findAll(): Promise<PostEntity[]> {
        const posts = await this.prisma.post.findMany({
            orderBy: { createdAt: "desc" },
        })
        return posts.map(
            (post) =>
                new PostEntity({
                    id: post.id,
                    title: post.title,
                    description: post.description,
                    imageUrl: post.imageUrl,
                    categoryId: post.categoryId,
                    createdAt: post.createdAt,
                    updatedAt: post.updatedAt,
                }),
        )
    }

    async getFeedPosts(categoryId?: string): Promise<PostFeedEntity[]> {
        const posts = await this.prisma.post.findMany({
            where: categoryId ? { categoryId } : undefined,
            include: { comments: true, likes: true, category: true },
        })

        return posts.map(
            (post) =>
                new PostFeedEntity({
                    id: post.id,
                    title: post.title,
                    description: post.description,
                    imageUrl: post.imageUrl,
                    categoryId: post.categoryId,
                    categoryName: post.category?.name ?? null,
                    createdAt: post.createdAt,
                    updatedAt: post.updatedAt,
                    likesCount: post.likes.reduce(
                        (sum, l) => sum + l.weight,
                        0,
                    ),
                    commentsCount: post.comments.length,
                    relevanceScore: 0,
                }),
        )
    }
}
