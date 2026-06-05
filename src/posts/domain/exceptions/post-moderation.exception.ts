export class PostModerationException extends Error {
    constructor(message = "Post bloqueado por moderación") {
        super(message)
        this.name = "PostModerationException"
    }
}
