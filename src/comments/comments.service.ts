import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common"
import { CreateCommentDto } from "@/posts/posts.dtos"
import { ModerationService } from "@/moderation/moderation.service"
import { FindPostByIdUseCase } from "@/posts/application/use-cases/find-post-by-id.use-case"
import { PrismaService } from "@/shared/prisma.service"

@Injectable()
export class CommentsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly findPostByIdUseCase: FindPostByIdUseCase,
        private readonly moderationService: ModerationService,
    ) {}

    async listByPostId(postId: string) {
        await this.assertPostExists(postId)

        const comments = await this.prisma.comment.findMany({
            where: { postId },
            orderBy: { createdAt: "desc" },
        })

        return {
            total_comments: comments.length,
            comments,
        }
    }

    async create(postId: string, data: CreateCommentDto) {
        await this.assertPostExists(postId)

        const moderation = await this.moderationService.moderate(data.content)
        if (!moderation.approved) {
            throw new BadRequestException(
                moderation.reason ?? "Comentario bloqueado por moderación",
            )
        }

        return this.prisma.comment.create({
            data: {
                postId,
                content: data.content,
                source: "comments-module",
            },
        })
    }

    private async assertPostExists(postId: string) {
        const post = await this.findPostByIdUseCase.execute(postId)
        if (!post) {
            throw new NotFoundException("Post no encontrado")
        }
    }
}
