import { Module } from "@nestjs/common"
import { FeedRankingStrategyFactory } from "@/posts/feed-ranking.strategy"
import { ModerationModule } from "@/moderation/moderation.module"
import { PostsController } from "@/posts/posts.controller"
import { PostsService } from "@/posts/posts.service"
import { PrismaPostRepository } from "./infrastructure/persistence/prisma-post.repository"
import { POST_REPOSITORY_TOKEN } from "./domain/repositories/post.repository.interface"

@Module({
    imports: [ModerationModule],
    controllers: [PostsController],
    providers: [
        PostsService, 
        FeedRankingStrategyFactory,
        {
            provide: POST_REPOSITORY_TOKEN,
            useClass: PrismaPostRepository,
        }
    ],
    exports: [PostsService],
})
export class PostsModule {}
