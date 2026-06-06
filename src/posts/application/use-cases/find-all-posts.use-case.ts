import { Inject, Injectable } from "@nestjs/common"

import { PostEntity } from "@/posts/domain/entities/post.entity"
import {
    IPostRepository,
    POST_REPOSITORY_TOKEN,
} from "@/posts/domain/repositories/post.repository.interface"

type FindAllPostsOutput = {
    total: number
    items: PostEntity[]
}

@Injectable()
export class FindAllPostsUseCase {
    constructor(
        @Inject(POST_REPOSITORY_TOKEN)
        private readonly postRepository: IPostRepository,
    ) {}

    async execute(): Promise<FindAllPostsOutput> {
        const posts = await this.postRepository.findAll()

        return {
            total: posts.length,
            items: posts,
        }
    }
}
