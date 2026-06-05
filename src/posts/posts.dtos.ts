import {
    IsIn,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    Length,
    Matches,
    MaxLength,
    Min,
} from "class-validator"

const NO_HTML_PATTERN = /^[^<>]*$/
const NO_HTML_MESSAGE = "No se permiten etiquetas HTML"

export class CreatePostDto {
    @IsString({ message: "El título debe ser un texto" })
    @IsNotEmpty({ message: "El título no puede estar vacío" })
    @Length(3, 120, {
        message: "El título debe tener entre 3 y 120 caracteres",
    })
    @Matches(NO_HTML_PATTERN, { message: NO_HTML_MESSAGE })
    title!: string

    @IsString({ message: "La descripción debe ser un texto" })
    @IsNotEmpty({ message: "La descripción no puede estar vacía" })
    @Length(10, 1000, {
        message: "La descripción debe tener entre 10 y 1000 caracteres",
    })
    @Matches(NO_HTML_PATTERN, { message: NO_HTML_MESSAGE })
    description!: string

    @IsString({ message: "La URL de imagen debe ser un texto" })
    @IsNotEmpty({ message: "La URL de imagen no puede estar vacía" })
    @IsUrl(
        { protocols: ["http", "https"], require_protocol: true },
        { message: "La URL de imagen no es válida" },
    )
    @MaxLength(2048, {
        message: "La URL de imagen no puede superar los 2048 caracteres",
    })
    @Matches(NO_HTML_PATTERN, { message: NO_HTML_MESSAGE })
    imageUrl!: string

    @IsOptional()
    @IsString({ message: "La categoría debe ser un texto" })
    categoryId?: string
}

export class CreateCommentDto {
    @IsString({ message: "El contenido debe ser un texto" })
    @IsNotEmpty({ message: "El contenido no puede estar vacío" })
    @Length(2, 400, {
        message: "El contenido debe tener entre 2 y 400 caracteres",
    })
    @Matches(NO_HTML_PATTERN, { message: NO_HTML_MESSAGE })
    content!: string
}

export class AddLikeDto {
    @IsOptional()
    @IsString({ message: "El tipo de reacción debe ser un texto" })
    @IsIn(["like", "fire", "clap"], {
        message: "Tipo de reacción no válida (like, fire, clap)",
    })
    reactionType?: string

    @IsOptional()
    @IsInt({ message: "El peso debe ser un número entero" })
    @Min(1, { message: "El peso debe ser al menos 1" })
    weight?: number
}

export class FeedQueryDto {
    @IsOptional()
    @IsString({ message: "El modo debe ser un texto" })
    @IsIn(["latest", "mostLiked", "mostCommented", "relevance"], {
        message: "Modo de feed no válido",
    })
    mode?: string

    @IsOptional()
    @IsString({ message: "La categoría debe ser un texto" })
    categoryId?: string
}
