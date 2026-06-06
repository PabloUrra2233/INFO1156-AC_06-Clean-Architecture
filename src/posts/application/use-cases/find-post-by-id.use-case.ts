import { Inject, Injectable } from "@nestjs/common"

import { PostEntity } from "@/posts/domain/entities/post.entity"
import {
    IPostRepository,
    POST_REPOSITORY_TOKEN,
} from "@/posts/domain/repositories/post.repository.interface"

@Injectable()
export class FindPostByIdUseCase {
    constructor(
        @Inject(POST_REPOSITORY_TOKEN)
        private readonly postRepository: IPostRepository,
    ) {}

    async execute(id: string): Promise<PostEntity | null> {
        return await this.postRepository.findById(id)
    }
}
