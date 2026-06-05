import { Inject, Injectable } from "@nestjs/common"

import { FeedRankingStrategyFactory } from "@/posts/feed-ranking.strategy"
import {
    IPostRepository,
    POST_REPOSITORY_TOKEN,
} from "@/posts/domain/repositories/post.repository.interface"

type GetRankedFeedInput = {
    categoryId?: string
    mode?: string
}

@Injectable()
export class GetRankedFeedUseCase {
    constructor(
        @Inject(POST_REPOSITORY_TOKEN)
        private readonly postRepository: IPostRepository,
        private readonly feedRankingFactory: FeedRankingStrategyFactory,
    ) {}

    async execute(input: GetRankedFeedInput) {
        const mode = input.mode ?? "latest"
        const feedPosts = await this.postRepository.getFeedPosts(
            input.categoryId,
        )
        const rankedPosts = this.feedRankingFactory
            .forMode(mode)
            .rank(feedPosts)

        return {
            mode,
            count: rankedPosts.length,
            rows: rankedPosts,
        }
    }
}
