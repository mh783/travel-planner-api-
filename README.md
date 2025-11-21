# Travel Planner API – NestJS + TypeORM + RestCountries

API REST construida con NestJS para la planificación de viajes, que incluye:

Módulo de países (Countries): consumo de la API externa RestCountries + almacenamiento local tipo caché.

Módulo de planes de viaje (TravelPlans): creación y consulta de planes asociados a países.

## Clonar el repositorio

## Instalar dependencias: npm install

## Este proyecto usa SQLite (archivo travel.db, que se crea automáticamente).

Configuración en app.module.ts:
TypeOrmModule.forRoot({
  type: 'sqlite',
  database: 'travel.db',
  autoLoadEntities: true,
  synchronize: true,
});
No requiere ninguna instalación externa.

## Ejecutar la API: npm run start:dev

## La API quedara disponible en: http://localhost:3000


# Descripción de la API:
## La API está organizada en dos módulos principales:
### CountriesModule:
Obtiene países mediante RestCountries (API externa).

Implementa un sistema de caché local:

Si el país existe en la base ➝ se devuelve desde cache

Si no existe ➝ se consulta la API externa, se guarda y se devuelve con external

Expone endpoints de consulta.
### TravelPlansModule:
Permite crear planes de viaje asociados a un país mediante validaciones (DTOs).

Si el país no existe localmente, se consulta automáticamente usando el CountriesModule.

Expone endpoints para listar y obtener planes.

# Endpoints implementados:
## Countries:

### Lista todos los países almacenados en la base local:
[
  {
    "code": "COL",
    "name": "Colombia",
    "region": "Americas",
    "capital": "Bogotá",
    "population": 50372424
  }
]
### GET /countries/:code:
Consulta un país por su código alpha-3.
Comportamiento:

Si está en la base → origin: "cache"

Si no está → se consulta RestCountries y se guarda → origin: "external"

#### Ejemplo:
{
  "origin": "external",
  "data": {
    "code": "COL",
    "name": "Colombia",
    "region": "Americas",
    "subregion": "South America",
    "capital": "Bogotá",
    "population": 53057212,
    "flag": "https://flagcdn.com/w320/co.png",
    "createdAt": "2025-11-19T21:29:40.000Z"
  }
}
# Travel plans:
## POST/plans:
Crea un nuevo plan de viaje.
BODY(JSON):
{
  "countryCode": "COL",
  "title": "Viaje a Bogotá",
  "startDate": "2025-01-01",
  "endDate": "2025-01-10",
  "notes": "Con amigos"
}
## GET/plans:
devuelve todos los planes

## GET/plans/id:
devuelve un plan por su id

# Provider externo:
El módulo Countries utiliza un provider especializado para consumir la API externa, lo que permite desacoplar la lógica de dominio de la infraestructura.

El provider implementa una interfaz (ExternalCountryService) y:

## 1.Hace la petición HTTP a:https://restcountries.com/v3.1/alpha/<code>
Extrae únicamente los campos necesarios.

Devuelve un objeto con el modelo Country listo para ser guardado en la base.

# Modelo de datos:
## Country:
| Campo      | Tipo   | Descripción            |
| ---------- | ------ | ---------------------- |
| code       | string | Código alpha-3 (PK)    |
| name       | string | Nombre del país        |
| region     | string | Región                 |
| subregion  | string | Subregión              |
| capital    | string | Capital                |
| population | number | Población              |
| flag       | string | URL de bandera         |
| createdAt  | Date   | Fecha de creación      |
| updatedAt  | Date   | Fecha de actualización |

## Travel plan:
| Campo       | Tipo   | Descripción             |
| ----------- | ------ | ----------------------- |
| id          | number | ID autogenerado         |
| countryCode | string | Código alpha-3 del país |
| title       | string | Título del viaje        |
| startDate   | string | Fecha de inicio         |
| endDate     | string | Fecha de fin            |
| notes       | string | Notas opcionales        |
| createdAt   | Date   | Fecha de creación       |

# Pruebas Básicas Sugeridas:
## Consultar pais NO cacheade:
GET /countries/COL
### Resultado esperado:
### origin: "external"
## Consultar el mismo país nuevamente:
### Resultado esperado:
### origin: "cache
## Crear un plan de viaje válido:
POST /plans
{
  "countryCode": "COL",
  "title": "Viaje de prueba",
  "startDate": "2025-01-01",
  "endDate": "2025-01-10"
}

## Listar todos los planes:
GET /plans


# Extensión Parcial
## Extensión de la API en este parcial

En esta ampliación se extendió la API creada en el preparcial agregando nuevas funcionalidades para fortalecer su seguridad y capacidad operativa. Se añadió un endpoint protegido para permitir la eliminación controlada de países almacenados en caché, incluyendo validaciones para evitar borrar registros que aún tengan planes de viaje asociados. Además, se implementó un guard de autorización basado en un token enviado mediante el encabezado `x-auth-token`, restringiendo el acceso únicamente a solicitudes válidas.

También se incorporó un middleware de logging aplicado a las rutas `/countries` y `/plans`, el cual registra el método HTTP, la ruta, el código de estado de la respuesta y el tiempo total de procesamiento. Esto mejora la trazabilidad de la API y permite monitorear su comportamiento en tiempo real.

## Descripción y validación del endpoint protegido, guard y middleware

### Endpoint protegido: `DELETE /countries/:code`
Este endpoint permite eliminar un país previamente almacenado en caché.  
Antes de borrar, el sistema verifica:
1. Que el país exista en la base de datos.
2. Que no existan planes de viaje asociados a ese país.

Si alguna de estas condiciones falla, se devuelve un error adecuado (`404` o `400`).  
Para validarlo, basta realizar un request DELETE a  
`http://localhost:3000/countries/COL`  
incluyendo el header `x-auth-token: parcial_1_token`.

---
### Guard de autorización
El guard verifica que cada solicitud al endpoint de borrado incluya un token válido en el encabezado `x-auth-token`.  
Si el header está ausente o el token es incorrecto:
- se bloquea el acceso,
- y el servidor responde con `401 Unauthorized` o `403 Forbidden`.

Para validarlo:
- enviar el DELETE sin el header → debe devolver 401.
- enviar el DELETE con un token incorrecto → debe devolver 403.
- enviar el DELETE con `x-auth-token: parcial_1_token` → debe ejecutarse normalmente.

---

### Middleware de logging
Se implementó un middleware personalizado que registra información de cada request en las rutas `/countries` y `/plans`, incluyendo:
- método HTTP,
- ruta solicitada,
- código de estado,
- tiempo total de procesamiento.

El registro se imprime en consola con el formato:

[LOG] GET /countries/COL -> 304 (15 ms)
[LOG] GET /countries -> 304 (2 ms)