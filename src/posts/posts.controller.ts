import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Query,
} from "@nestjs/common"

import { CreatePostUseCase } from "@/posts/application/use-cases/create-post.use-case"
import { GetRankedFeedUseCase } from "@/posts/application/use-cases/get-ranked-feed.use-case"
import { PostModerationException } from "@/posts/domain/exceptions/post-moderation.exception"
import { CreatePostDto, FeedQueryDto } from "@/posts/posts.dtos"
import { PostsService } from "@/posts/posts.service"

@Controller("api/posts")
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
        private readonly createPostUseCase: CreatePostUseCase,
        private readonly getRankedFeedUseCase: GetRankedFeedUseCase,
    ) {}

    @Post()
    async create(@Body() body: CreatePostDto) {
        try {
            const created = await this.createPostUseCase.execute({
                title: body.title,
                description: body.description,
                imageUrl: body.imageUrl,
                categoryId: body.categoryId,
            })

            return {
                ok: true,
                payload: created,
            }
        } catch (error) {
            if (error instanceof PostModerationException) {
                throw new BadRequestException(error.message)
            }

            throw error
        }
    }

    @Get()
    async findAll() {
        const posts = await this.postsService.findAll()

        return {
            total: posts.length,
            items: posts,
        }
    }

    @Get("feed")
    async getFeed(@Query() query: FeedQueryDto) {
        return this.getRankedFeedUseCase.execute({
            categoryId: query.categoryId,
            mode: query.mode,
        })
    }
}
