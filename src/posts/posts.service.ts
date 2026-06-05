import { Inject, Injectable } from "@nestjs/common"

import {
    IPostRepository,
    POST_REPOSITORY_TOKEN,
} from "./domain/repositories/post.repository.interface"

@Injectable()
export class PostsService {
    constructor(
        @Inject(POST_REPOSITORY_TOKEN)
        private readonly postRepository: IPostRepository,
    ) {}

    findAll() {
        return this.postRepository.findAll()
    }

    findById(id: string) {
        return this.postRepository.findById(id)
    }

    async getFeedPosts(categoryId?: string) {
        return await this.postRepository.getFeedPosts(categoryId)
    }
}
