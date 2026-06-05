import { Inject, Injectable } from "@nestjs/common"

import { ModerationService } from "@/moderation/moderation.service"
import { PostModerationException } from "@/posts/domain/exceptions/post-moderation.exception"
import {
    IPostRepository,
    POST_REPOSITORY_TOKEN,
} from "@/posts/domain/repositories/post.repository.interface"

type CreatePostInput = {
    title: string
    description: string
    imageUrl: string
    categoryId?: string
}

@Injectable()
export class CreatePostUseCase {
    constructor(
        @Inject(POST_REPOSITORY_TOKEN)
        private readonly postRepository: IPostRepository,
        private readonly moderationService: ModerationService,
    ) {}

    async execute(input: CreatePostInput) {
        const text = `${input.title} ${input.description}`
        const moderation = await this.moderationService.moderate(text)

        if (!moderation.approved) {
            throw new PostModerationException(
                moderation.reason ?? "Post bloqueado por moderación",
            )
        }

        return await this.postRepository.create(input)
    }
}
