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
### ❗️ Problema 2: [Indique nombre del problema...]
* **Descripción:** [Indique descripción del problema...].
* **Impacto:** [Indique el impacto que poseía el problema en el proyecto...].

### 🛠 Solución implementada:
* **Estrategia:** [Indique su solución/estrategia para solucionar el problema...].
* **Justificación:** Indique la razón de esa estrategia como solución al problema...

<!--Aqui el diagrama de clases y/o codigo resumido de apoyo.-->
<!--Se recomienda usar PlantUML para los diagramas, aunque otros formatos son aceptados igual.-->
<p align="center">
  <img src="ruta/ejemplo..." alt="indicar tipo de patron..." width="80"/>
</p>

---
...
<!--Si se requiere, siga agregando problemas con el mismo formato con tal de mantener el orden.-->