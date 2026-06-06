import { Module } from "@nestjs/common"

import { CreatePostUseCase } from "@/posts/application/use-cases/create-post.use-case"
import { FindAllPostsUseCase } from "@/posts/application/use-cases/find-all-posts.use-case"
import { FindPostByIdUseCase } from "@/posts/application/use-cases/find-post-by-id.use-case"
import { GetRankedFeedUseCase } from "@/posts/application/use-cases/get-ranked-feed.use-case"
import { POST_REPOSITORY_TOKEN } from "@/posts/domain/repositories/post.repository.interface"
import { FeedRankingStrategyFactory } from "@/posts/domain/strategies/feed-ranking.strategy"
import { PrismaPostRepository } from "@/posts/infrastructure/persistence/prisma-post.repository"
import { ModerationModule } from "@/moderation/moderation.module"
import { PostsController } from "@/posts/posts.controller"

@Module({
    imports: [ModerationModule],
    controllers: [PostsController],
    providers: [
        CreatePostUseCase,
        FindAllPostsUseCase,
        FindPostByIdUseCase,
        GetRankedFeedUseCase,
        FeedRankingStrategyFactory,
        {
            provide: POST_REPOSITORY_TOKEN,
            useClass: PrismaPostRepository,
        },
    ],
    exports: [FindAllPostsUseCase, FindPostByIdUseCase],
})
export class PostsModule { }
