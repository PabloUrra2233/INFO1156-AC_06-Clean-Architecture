import { Module } from "@nestjs/common"

import { CreatePostUseCase } from "@/posts/application/use-cases/create-post.use-case"
import { GetRankedFeedUseCase } from "@/posts/application/use-cases/get-ranked-feed.use-case"
import { POST_REPOSITORY_TOKEN } from "@/posts/domain/repositories/post.repository.interface"
import { FeedRankingStrategyFactory } from "@/posts/feed-ranking.strategy"
import { PrismaPostRepository } from "@/posts/infrastructure/persistence/prisma-post.repository"
import { ModerationModule } from "@/moderation/moderation.module"
import { PostsController } from "@/posts/posts.controller"
import { PostsService } from "@/posts/posts.service"

@Module({
    imports: [ModerationModule],
    controllers: [PostsController],
    providers: [
        PostsService,
        CreatePostUseCase,
        GetRankedFeedUseCase,
        FeedRankingStrategyFactory,
        {
            provide: POST_REPOSITORY_TOKEN,
            useClass: PrismaPostRepository,
        },
    ],
    exports: [PostsService],
})
export class PostsModule {}
