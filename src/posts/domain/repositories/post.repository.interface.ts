import { PostEntity, PostFeedEntity } from "../entities/post.entity"

export const POST_REPOSITORY_TOKEN = Symbol("IPostRepository")

export interface IPostRepository {
    create(data: {
        title: string
        description: string
        imageUrl: string
        categoryId?: string
    }): Promise<PostEntity>

    findById(id: string): Promise<PostEntity | null>

    findAll(): Promise<PostEntity[]>

    getFeedPosts(categoryId?: string): Promise<PostFeedEntity[]>
}
