export class PostEntity {
    id!: string;
    title!: string;
    description!: string;
    imageUrl!: string;
    categoryId!: string | null;
    createdAt!: Date;
    updatedAt!: Date;

    constructor(partial: Partial<PostEntity>) {
        Object.assign(this, partial);
    }
}

export class PostFeedEntity extends PostEntity {
    categoryName!: string | null;
    likesCount!: number;
    commentsCount!: number;
    relevanceScore!: number;

    constructor(partial: Partial<PostFeedEntity>) {
        super(partial);
        Object.assign(this, partial);
    }
}
