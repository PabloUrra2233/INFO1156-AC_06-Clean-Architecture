import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common"
import { AddLikeDto } from "@/posts/posts.dtos"
import { FindPostByIdUseCase } from "@/posts/application/use-cases/find-post-by-id.use-case"
import { PrismaService } from "@/shared/prisma.service"

@Injectable()
export class LikesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly findPostByIdUseCase: FindPostByIdUseCase,
    ) {}

    async create(postId: string, data: AddLikeDto) {
        await this.assertPostExists(postId)

        const weight = data.weight ?? 1

        if (weight < 1) {
            throw new BadRequestException("El peso debe ser al menos 1")
        }

        return this.prisma.like.create({
            data: {
                postId,
                reactionType: data.reactionType ?? "like",
                weight,
                source: "likes-module",
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
