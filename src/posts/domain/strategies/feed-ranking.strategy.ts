import { Injectable } from "@nestjs/common"

import { PostFeedEntity } from "@/posts/domain/entities/post.entity"

export type FeedMode = "latest" | "mostLiked" | "mostCommented" | "relevance"

interface FeedRankingStrategy {
    rank(posts: PostFeedEntity[]): PostFeedEntity[]
}

class LatestRankingStrategy implements FeedRankingStrategy {
    rank(posts: PostFeedEntity[]): PostFeedEntity[] {
        return [...posts].sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        )
    }
}

class MostLikedRankingStrategy implements FeedRankingStrategy {
    rank(posts: PostFeedEntity[]): PostFeedEntity[] {
        return [...posts].sort((a, b) => b.likesCount - a.likesCount)
    }
}

class MostCommentedRankingStrategy implements FeedRankingStrategy {
    rank(posts: PostFeedEntity[]): PostFeedEntity[] {
        return [...posts].sort((a, b) => b.commentsCount - a.commentsCount)
    }
}

class RelevanceRankingStrategy implements FeedRankingStrategy {
    rank(posts: PostFeedEntity[]): PostFeedEntity[] {
        return [...posts].sort((a, b) => b.relevanceScore - a.relevanceScore)
    }
}

@Injectable()
export class FeedRankingStrategyFactory {
    private readonly latest = new LatestRankingStrategy()
    private readonly mostLiked = new MostLikedRankingStrategy()
    private readonly mostCommented = new MostCommentedRankingStrategy()
    private readonly relevance = new RelevanceRankingStrategy()

    forMode(mode: string): FeedRankingStrategy {
        if (mode === "mostLiked") {
            return this.mostLiked
        }

        if (mode === "mostCommented") {
            return this.mostCommented
        }

        if (mode === "relevance") {
            return this.relevance
        }

        return this.latest
    }
}
