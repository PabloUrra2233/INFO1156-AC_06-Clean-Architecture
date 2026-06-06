# Reporte de Proyecto: Identificación de Problemas y Soluciones

Este documento detalla el análisis del sistema, los problemas de diseño o implementación identificados en la arquitectura inicial y las soluciones técnicas aplicadas para resolverlos.

<p align="center">
  <img src="img/wip.png" alt="Herramientas de trabajo entrecruzadas" width="80"/>
</p>


## Problemas Identificados / Solución Implementada

En esta sección se describen las deficiencias, bugs o limitaciones técnicas encontradas en el sistema original.

### ❗️ Problema 1:  Violación de Inversión de Dependencias (Acoplamiento al ORM)
* **Descripción:** La capa de logica de negocio de (`PostsService`) inyectaba y dependia directamente de la clase concreta `PrismaService`, utilizando comandos especificos de el motor Prisma para acceder a los datos.
* **Impacto:** Generaba un alto acoplamiento tecnologico. Hacia imposible que si en dado caso se tuviese que remplazar Prisma por otro ORM en el futuro, seria ciertamente imposible no tener que reescribir toda la logica de negocio y donde por otro lado, dificultaba la creacion de tests unitarios aislados.

### 🛠 Solución implementada:
* **Estrategia:** Se implemento el Patron Repositorio. Se creo una abstraccion en (`IPostRepository`) y entidades puras en el Domain. Toda la logica que poseia Prisma se movio a una clase de Infraestructura (`PrismaPostRepository`). Finalmente el `PostsService` paso a depender unicamente de la interfaz mediante la tecnica de Inyeccion de Dependencias.
* **Justificación:** Al aislar los detalles de infraestructura detras de un "contrato" (la interfaz), la aplicacion y la logica de negocio queda protegida de cambios externos y el codigo se vuelve altamente testeable al no depender fuertemente de Prisma.

<!--Aqui el diagrama de clases y/o codigo resumido de apoyo.-->
<!--Se recomienda usar PlantUML para los diagramas, aunque otros formatos son aceptados igual.-->
<p align="center">
  <img src="img/problema1.png" alt="Patron de Diseño Repositorio" width="550"/>
</p>


---
### ❗️ Problema 2: Lógica de negocio acoplada a NestJS y HTTP

* **Descripción:** La lógica de creación de publicaciones estaba mezclada con detalles propios del framework NestJS. En particular, `PostsService` lanzaba directamente `BadRequestException` cuando una publicación era rechazada por moderación. Además, el método `create` recibía directamente `CreatePostDto`, que pertenece a la capa de presentación.

* **Impacto:** Esto generaba acoplamiento entre la lógica de negocio y HTTP. Si se quisiera reutilizar esta lógica fuera de un controlador REST, por ejemplo en tests unitarios, jobs internos o WebSockets, seguiría dependiendo de excepciones propias de NestJS. También dificultaba probar la regla de negocio de moderación de forma aislada.

### 🛠 Solución implementada:

* **Estrategia:** Se creó una excepción propia del dominio llamada `PostModerationException` y se movió la lógica de creación de publicaciones a `CreatePostUseCase`. El caso de uso ejecuta la moderación y, si el contenido es rechazado, lanza una excepción de dominio. Luego, el controlador se encarga de traducir esa excepción a una respuesta HTTP mediante `BadRequestException`.

* **Justificación:** Con este cambio, la capa de aplicación expresa reglas del negocio sin depender directamente de HTTP. La traducción a códigos de estado queda en la capa de presentación, respetando la separación de responsabilidades propuesta por Clean Architecture.

```ts
export class PostModerationException extends Error {
    constructor(message = "Post bloqueado por moderación") {
        super(message)
        this.name = "PostModerationException"
    }
}
```

```ts
if (!moderation.approved) {
    throw new PostModerationException(
        moderation.reason ?? "Post bloqueado por moderación",
    )
}
```


---
...
### ❗️ Problema 3: `PostsService` con demasiadas responsabilidades

* **Descripción:** `PostsService` concentraba múltiples operaciones: crear publicaciones, listar publicaciones, buscar por ID y obtener los datos del feed. Además, el controlador de posts contenía lógica de aplicación al obtener los posts del feed y aplicar directamente una estrategia de ranking.

* **Impacto:** Esta estructura rompía el principio de responsabilidad única, ya que una misma clase podía cambiar por muchos motivos distintos. También hacía que el controlador dejara de ser una capa delgada, porque no solo recibía la petición HTTP, sino que también participaba en la orquestación del caso de uso del feed.

### 🛠 Solución implementada:

* **Estrategia:** Se separó la lógica en casos de uso específicos. `CreatePostUseCase` quedó encargado de crear publicaciones y validar moderación, mientras que `GetRankedFeedUseCase` quedó encargado de obtener los posts del feed y aplicar el ranking correspondiente mediante `FeedRankingStrategyFactory`.

* **Justificación:** Al dividir la lógica en casos de uso, cada clase tiene una responsabilidad clara. El controlador queda limitado a recibir parámetros, llamar al caso de uso correspondiente y devolver la respuesta. Esto mejora la mantenibilidad, facilita las pruebas y acerca el servidor a Clean Architecture.

```ts
async getFeed(@Query() query: FeedQueryDto) {
    return this.getRankedFeedUseCase.execute({
        categoryId: query.categoryId,
        mode: query.mode,
    })
}
```

```ts
async execute(input: GetRankedFeedInput) {
    const mode = input.mode ?? "latest"
    const feedPosts = await this.postRepository.getFeedPosts(input.categoryId)
    const rankedPosts = this.feedRankingFactory.forMode(mode).rank(feedPosts)

    return {
        mode,
        count: rankedPosts.length,
        rows: rankedPosts,
    }
}
```

---

## Diagrama de clases resumido de la refactorización

```mermaid
classDiagram
    class PostsController {
        +create(body)
        +getFeed(query)
    }

    class CreatePostUseCase {
        +execute(input)
    }

    class GetRankedFeedUseCase {
        +execute(input)
    }

    class PostModerationException

    class IPostRepository {
        <<interface>>
        +create(data)
        +findAll()
        +findById(id)
        +getFeedPosts(categoryId)
    }

    class FeedRankingStrategyFactory {
        +forMode(mode)
    }

    PostsController --> CreatePostUseCase
    PostsController --> GetRankedFeedUseCase
    CreatePostUseCase --> IPostRepository
    CreatePostUseCase ..> PostModerationException
    GetRankedFeedUseCase --> IPostRepository
    GetRankedFeedUseCase --> FeedRankingStrategyFactory
```
