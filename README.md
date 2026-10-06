 # Learning Node.js

🇷🇺 [Русская версия](#ru) | 🇬🇧 [English version](#en)

---

<a id="ru"></a>

# 🇷🇺 Русская версия

## О проекте

Этот репозиторий — мой учебный backend-проект на **Node.js + TypeScript + PostgreSQL**.

Моя основная специализация — frontend-разработка на React/TypeScript. Цель проекта — последовательно расширить знания в сторону backend и fullstack-разработки и разобраться не только в использовании готовых фреймворков, но и в том, как серверное приложение работает на более низком уровне.

Поэтому первые этапы проекта реализуются на чистом Node.js через `node:http`, без Express и NestJS.

Такой подход позволяет последовательно разобраться с:

- HTTP request / response lifecycle
- routing
- streams
- Promise / async-await
- runtime validation
- environment variables
- обработкой ошибок
- архитектурными слоями
- SQL
- PostgreSQL
- migrations
- repository pattern

а уже затем переходить к более высокоуровневым backend-инструментам.

---

## Текущий этап

На текущем этапе реализован REST API для работы с пользователями с постоянным хранением данных в **PostgreSQL**.

Полный CRUD больше не зависит от in-memory массива.

Основной поток приложения:

```text
HTTP request
    ↓
Router
    ↓
Controller
    ↓
Service
    ↓
Repository
    ↓
PostgreSQL
    ↓
Repository
    ↓
Service
    ↓
Controller
    ↓
HTTP response
```

### Endpoints

```text
GET     /users
GET     /users/:id
POST    /users
PATCH   /users/:id
DELETE  /users/:id
```

`GET /users` также поддерживает:

- filtering
- search
- sorting
- pagination

На текущем этапе эти операции выполняются в Node.js после получения данных из PostgreSQL.

Следующий шаг — постепенно перенести фильтрацию, поиск, сортировку и пагинацию на уровень SQL.

---

## Что уже реализовано

### HTTP и REST

- HTTP-сервер через `node:http`
- собственный router
- CRUD для пользователей
- получение `id` из URL
- работа с query parameters
- HTTP status codes
- JSON parsing
- request body через Node.js streams
- обработка `400`, `404` и `500`
- централизованная обработка ошибок
- reusable helpers для JSON/error responses

---

## Архитектура

Приложение разделено на отдельные слои:

```text
Router
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
PostgreSQL
```

### Router

Определяет:

- HTTP method
- URL
- нужный controller

Router не содержит бизнес-логику и не работает напрямую с базой данных.

### Controller

Отвечает за HTTP-слой:

- request / response
- чтение request body
- JSON parsing
- URL parameters
- query parameters
- runtime validation
- HTTP status codes
- вызов service

### Service

Service layer отвечает за бизнес-логику приложения.

Он:

- не работает с HTTP напрямую
- не содержит SQL
- вызывает repository
- возвращает данные controller-слою

### Repository

Repository отвечает за доступ к данным.

Именно здесь находятся SQL-запросы:

```text
SELECT
INSERT
UPDATE
DELETE
```

Repository знает о PostgreSQL, но ничего не знает о HTTP.

### Database

PostgreSQL является постоянным хранилищем данных.

Данные больше не находятся в памяти процесса Node.js и сохраняются после перезапуска приложения.

---

## PostgreSQL

Для работы с PostgreSQL используется пакет:

```text
pg
```

Подключение создаётся через:

```ts
Pool
```

Пример потока:

```text
Service
   ↓
Repository
   ↓
Pool
   ↓
PostgreSQL
```

---

## SQL

В проекте уже используются основные CRUD-команды SQL.

### Получение списка пользователей

```sql
SELECT *
FROM users
ORDER BY id;
```

### Получение пользователя по ID

```sql
SELECT *
FROM users
WHERE id = $1;
```

### Создание пользователя

```sql
INSERT INTO users (name, age, email, city)
VALUES ($1, $2, $3, $4)
RETURNING *;
```

### Обновление пользователя

Для частичного обновления используется `COALESCE`:

```sql
UPDATE users
SET
  name = COALESCE($1, name),
  age = COALESCE($2, age),
  email = COALESCE($3, email),
  city = COALESCE($4, city)
WHERE id = $5
RETURNING *;
```

Это позволяет не изменять поля, которые отсутствуют в `PATCH` request.

### Удаление пользователя

```sql
DELETE FROM users
WHERE id = $1
RETURNING *;
```

`RETURNING *` позволяет сразу получить созданную, обновлённую или удалённую строку.

---

## Parameterized SQL queries

Пользовательские значения не вставляются напрямую в SQL-строку.

Вместо:

```ts
`SELECT * FROM users WHERE id = ${id}`
```

используются параметры:

```ts
db.query(
  'SELECT * FROM users WHERE id = $1',
  [id],
)
```

Принцип:

```text
SQL query
+
parameters
```

Например:

```text
$1 → id
```

Такой подход отделяет SQL-код от входных данных.

---

## Database migrations

Структура базы данных хранится в SQL migrations.

```text
database/
└── migrations/
    ├── 001_create_users.sql
    └── 002_users_id_identity.sql
```

### 001_create_users.sql

Создаёт таблицу:

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  email TEXT UNIQUE NOT NULL,
  city TEXT NOT NULL
);
```

### 002_users_id_identity.sql

Добавляет автоматическую генерацию `id`:

```sql
ALTER TABLE users
ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY;
```

После этого PostgreSQL самостоятельно создаёт новый `id` при `INSERT`.

Также sequence синхронизируется с уже существующими записями.

Важный принцип:

```text
migration file
    ↓
SQL instructions
    ↓
psql / migration runner
    ↓
PostgreSQL
    ↓
database schema changed
```

Файл миграции сам по себе не изменяет базу — SQL из него должен быть выполнен.

---

## Request body и streams

Тело HTTP-запроса поступает в Node.js как stream.

Используются события:

```ts
req.on('data', ...)
req.on('end', ...)
req.on('error', ...)
```

Низкоуровневая логика чтения request body вынесена в отдельную функцию:

```ts
readRequestBody(req)
```

Она преобразует event-based API Node.js в Promise-based API:

```text
request stream
    ↓
chunks
    ↓
end
    ↓
Promise<string>
    ↓
await
```

Благодаря этому controller может работать с body линейно:

```ts
const body = await readRequestBody(req)
```

---

## Асинхронность

Работа с PostgreSQL является I/O-операцией.

Поэтому асинхронность проходит через все слои приложения:

```text
Router
  ↓ await
Controller
  ↓ await
Service
  ↓ await
Repository
  ↓ await
PostgreSQL
```

Например:

```text
GET /users/:id
    ↓
getUserByIdController()
    ↓
getUserById()
    ↓
getUserByIdFromDb()
    ↓
db.query()
```

Repository возвращает `Promise`, поэтому вызывающие его слои также работают асинхронно.

---

## Runtime validation

Внешний JSON не считается доверенным TypeScript-типом.

Вместо:

```ts
const data: CreateUserData = JSON.parse(body)
```

используется:

```ts
const data: unknown = JSON.parse(body)
```

После этого выполняется runtime validation.

Используются:

- `unknown`
- `Record<string, unknown>`
- type guards
- type predicates
- type narrowing

Например:

```ts
(data: unknown): data is CreateUserData
```

Проверяются не только TypeScript-типы, но и значения:

- `name` — непустая строка
- `age` — валидное целое число
- `email` — базовая проверка формата
- `city` — непустая строка

Для `PATCH` поля optional.

Поле можно не передавать, но если оно присутствует — значение должно пройти validation.

---

## Query parameters

`GET /users` поддерживает параметры для работы со списком пользователей.

Используются:

```text
city
search
sort
order
page
limit
```

Общий поток:

```text
URLSearchParams
      ↓
parseGetUsersQuery()
      ↓
validated GetUsersParams
      ↓
service
      ↓
filter / search / sort / pagination
```

На текущем этапе PostgreSQL возвращает пользователей, после чего обработка query parameters выполняется в Node.js.

Планируемое улучшение:

```text
Node.js filtering
      ↓
SQL WHERE / ORDER BY / LIMIT / OFFSET
```

---

## Pagination

API возвращает не только данные, но и metadata:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 4,
    "totalPages": 1
  }
}
```

Используются:

```text
page
limit
total
totalPages
```

На текущем этапе pagination выполняется в service layer через работу с массивом результатов PostgreSQL.

Позже она будет перенесена в SQL через:

```sql
LIMIT
OFFSET
```

---

## Error handling

В проекте реализована централизованная обработка ошибок.

Используется собственный:

```ts
HttpError
```

Router оборачивает обработку request в `try/catch`:

```text
request
   ↓
router
   ↓
controller
   ↓
service
   ↓
repository
   ↓
error
   ↓
handleError()
   ↓
HTTP response
```

Известные HTTP-ошибки возвращаются клиенту с соответствующим status code.

Неизвестные внутренние ошибки:

- логируются через `console.error`
- возвращаются клиенту как `500 Internal server error`

Внутренние детали PostgreSQL при этом не отправляются клиенту.

---

## Environment variables

Конфигурация приложения вынесена из основной бизнес-логики.

Используются environment variables для параметров приложения и PostgreSQL.

Например:

```text
PORT
DB_HOST
DB_PORT
DB_NAME
DB_USER
```

Поток конфигурации:

```text
.env / environment
      ↓
process.env
      ↓
config/env.ts
      ↓
application
```

Для загрузки `.env` используется:

```ts
import 'dotenv/config'
```

Запуск development-сервера:

```bash
npm run dev
```

---

## File System

В рамках изучения Node.js также был разобран File System API:

```ts
node:fs/promises
```

Изучены:

- `readFile()`
- `writeFile()`
- `appendFile()`
- `mkdir()`
- `stat()`
- `unlink()`
- `rm()`
- `recursive: true`

Также была разобрана системная ошибка:

```text
ENOENT
```

которая возникает при обращении к отсутствующему файлу или пути.

---

## Основная структура проекта

```text
database/
└── migrations/
    ├── 001_create_users.sql
    └── 002_users_id_identity.sql

src/
├── index.ts
├── server.ts
├── router.ts
│
├── config/
│   └── env.ts
│
├── database/
│   └── db.ts
│
├── shared/
│   ├── errors/
│   │   ├── error-handler.ts
│   │   └── http-error.ts
│   │
│   └── http/
│       ├── request.utils.ts
│       └── response.utils.ts
│
└── users/
    ├── validation/
    │   ├── user.query.ts
    │   └── user.validation.ts
    │
    ├── user.controller.ts
    ├── user.repository.ts
    ├── user.service.ts
    └── user.types.ts
```

Структура развивается в сторону feature-based архитектуры с разделением ответственности между слоями.

---

## Почему сначала чистый Node.js

Можно было сразу использовать Express или NestJS.

Но цель проекта — сначала понять, какую работу эти инструменты выполняют внутри.

Например, сейчас request body читается через:

```ts
req.on('data', ...)
req.on('end', ...)
```

Позже во фреймворке это может выглядеть просто как:

```ts
req.body
```

Но к этому моменту уже будет понимание:

- откуда появляется body
- что такое stream
- что такое chunk
- почему чтение является асинхронным
- когда request считается полностью прочитанным

Тот же подход применяется к:

- routing
- validation
- error handling
- configuration
- database access
- repository pattern
- dependency injection
- middleware

---

# План развития

## 1. Node.js fundamentals

Пройдено:

- [x] `node:http`
- [x] HTTP request / response
- [x] asynchronous code
- [x] Promise
- [x] async / await
- [x] streams
- [x] chunks
- [x] ESM modules
- [x] environment variables
- [x] `process.env`
- [x] filesystem
- [x] основы `path`
- [x] filesystem errors

Следующие темы:

- [ ] EventEmitter
- [ ] Event Loop подробнее
- [ ] timers
- [ ] углублённая работа с Node.js internals

---

## 2. REST API

Реализовано:

- [x] CRUD
- [x] router
- [x] controllers
- [x] services
- [x] runtime validation
- [x] HTTP status codes
- [x] request body parsing
- [x] URL API
- [x] query parameters
- [x] pagination
- [x] filtering
- [x] search
- [x] sorting
- [x] centralized error handling
- [x] reusable HTTP response helpers

Следующие этапы:

- [ ] reusable validation schemas
- [ ] Zod
- [ ] более универсальный routing
- [ ] перенос filtering/search/sorting/pagination в SQL

---

## 3. Архитектура приложения

Реализовано:

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Repositories
  ↓
Database
```

Пройдено:

- [x] separation of concerns
- [x] configuration layer
- [x] repository pattern
- [x] feature-based структура
- [x] централизованный error handling

Следующие темы:

- [ ] dependency injection
- [ ] reusable modules
- [ ] дальнейшее развитие application architecture

---

## 4. PostgreSQL и SQL

Реализовано:

- [x] PostgreSQL setup
- [x] подключение через `pg`
- [x] connection pool
- [x] repository layer
- [x] migration для таблицы `users`
- [x] identity generation для `id`
- [x] перенос CRUD из memory в PostgreSQL
- [x] `SELECT`
- [x] `INSERT`
- [x] `UPDATE`
- [x] `DELETE`
- [x] `WHERE`
- [x] `ORDER BY`
- [x] primary key
- [x] `UNIQUE`
- [x] `NOT NULL`
- [x] parameterized queries
- [x] migrations

Следующие темы:

- [ ] `LIMIT`
- [ ] `OFFSET`
- [ ] SQL filtering
- [ ] SQL search
- [ ] dynamic `ORDER BY`
- [ ] `JOIN`
- [ ] `GROUP BY`
- [ ] indexes подробнее
- [ ] foreign keys
- [ ] relations
- [ ] transactions

---

## 5. NestJS

После понимания базовых механизмов Node.js перенести API на NestJS.

Изучить:

- modules
- controllers
- providers
- services
- dependency injection
- DTO
- pipes
- guards
- interceptors
- exception filters
- configuration

---

## 6. Authentication & Security

Добавить:

- registration
- authentication
- password hashing
- JWT
- authorization
- roles
- validation
- security basics

---

## 7. Testing

Добавить:

- unit tests
- integration tests
- API tests
- database integration tests

---

## 8. Docker

Контейнеризировать приложение:

```text
Node.js API
    +
PostgreSQL
    +
Docker Compose
```

---

## 9. Fullstack

Финальная цель — связать backend с frontend-приложением на React/TypeScript.

```text
React
  ↓
REST API
  ↓
Node.js / NestJS
  ↓
PostgreSQL
```

---

## Цель

Моя цель — перейти от frontend-разработки к пониманию полного жизненного цикла приложения:

```text
Frontend
   ↓
HTTP / API
   ↓
Backend
   ↓
Database
   ↓
Infrastructure
```

Я хочу понимать:

- как проектируется API
- как сервер обрабатывает HTTP-запросы
- как работает asynchronous I/O
- как устроена бизнес-логика
- как приложение валидирует внешние данные
- как backend взаимодействует с файловой системой
- как backend работает с PostgreSQL
- как проектируются SQL-запросы
- как разделяются application layers
- как работает authentication / authorization
- как приложение тестируется
- как оно собирается и запускается в production

Итоговая цель — развитие в направлении **Fullstack / Software Engineering**.

---

<a id="en"></a>

# 🇬🇧 English version

## About

This repository is my backend learning project built with **Node.js + TypeScript + PostgreSQL**.

My main background is frontend development with React and TypeScript.

The goal of this project is to gradually expand my knowledge into backend and fullstack development and understand not only how backend frameworks are used, but also how server-side applications work internally.

For this reason, the first stages are implemented using native Node.js with `node:http`, without Express or NestJS.

This approach helps me understand:

- HTTP request / response lifecycle
- routing
- streams
- Promise / async-await
- runtime validation
- environment variables
- error handling
- application layers
- SQL
- PostgreSQL
- migrations
- repository pattern

before moving to higher-level backend frameworks.

---

## Current stage

The project currently contains a REST API for users with persistent data storage in **PostgreSQL**.

The CRUD implementation no longer depends on an in-memory array.

Main application flow:

```text
HTTP request
    ↓
Router
    ↓
Controller
    ↓
Service
    ↓
Repository
    ↓
PostgreSQL
    ↓
Repository
    ↓
Service
    ↓
Controller
    ↓
HTTP response
```

### Endpoints

```text
GET     /users
GET     /users/:id
POST    /users
PATCH   /users/:id
DELETE  /users/:id
```

`GET /users` also supports:

- filtering
- search
- sorting
- pagination

At the current stage these operations are performed in Node.js after loading users from PostgreSQL.

The next step is moving filtering, searching, sorting, and pagination into SQL.

---

## Current implementation

### HTTP and REST

Implemented:

- HTTP server using `node:http`
- custom router
- user CRUD operations
- URL parameter parsing
- query parameters
- HTTP status codes
- JSON parsing
- request body reading through Node.js streams
- `400`, `404`, and `500` error handling
- centralized error handling
- reusable JSON/error response helpers

---

## Architecture

The application is separated into dedicated layers:

```text
Router
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
PostgreSQL
```

### Router

Responsible for:

- HTTP method
- URL matching
- controller selection

The router does not contain business logic and does not access the database directly.

### Controller

Responsible for HTTP concerns:

- request / response
- request body
- JSON parsing
- URL parameters
- query parameters
- runtime validation
- HTTP status codes
- service invocation

### Service

The service layer contains application business logic.

It:

- does not work directly with HTTP
- does not contain SQL
- invokes repositories
- returns data to controllers

### Repository

The repository layer is responsible for data access.

SQL queries live here:

```text
SELECT
INSERT
UPDATE
DELETE
```

The repository knows about PostgreSQL but does not know anything about HTTP.

### Database

PostgreSQL is the persistent data storage layer.

User data is no longer tied to the Node.js process memory and survives application restarts.

---

## PostgreSQL

PostgreSQL access uses:

```text
pg
```

Connections are managed through:

```ts
Pool
```

Flow:

```text
Service
   ↓
Repository
   ↓
Pool
   ↓
PostgreSQL
```

---

## SQL

The project currently uses the main CRUD SQL commands.

### Fetch users

```sql
SELECT *
FROM users
ORDER BY id;
```

### Fetch user by ID

```sql
SELECT *
FROM users
WHERE id = $1;
```

### Create user

```sql
INSERT INTO users (name, age, email, city)
VALUES ($1, $2, $3, $4)
RETURNING *;
```

### Update user

Partial updates use `COALESCE`:

```sql
UPDATE users
SET
  name = COALESCE($1, name),
  age = COALESCE($2, age),
  email = COALESCE($3, email),
  city = COALESCE($4, city)
WHERE id = $5
RETURNING *;
```

Fields omitted from a `PATCH` request keep their existing values.

### Delete user

```sql
DELETE FROM users
WHERE id = $1
RETURNING *;
```

`RETURNING *` allows the API to immediately receive the inserted, updated, or deleted database row.

---

## Parameterized SQL queries

External values are not interpolated directly into SQL strings.

Instead of:

```ts
`SELECT * FROM users WHERE id = ${id}`
```

the project uses parameters:

```ts
db.query(
  'SELECT * FROM users WHERE id = $1',
  [id],
)
```

Conceptually:

```text
SQL query
+
parameters
```

For example:

```text
$1 → id
```

This keeps SQL code separate from external values.

---

## Database migrations

Database schema changes are stored as SQL migrations.

```text
database/
└── migrations/
    ├── 001_create_users.sql
    └── 002_users_id_identity.sql
```

### 001_create_users.sql

Creates the users table:

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  email TEXT UNIQUE NOT NULL,
  city TEXT NOT NULL
);
```

### 002_users_id_identity.sql

Adds automatic ID generation:

```sql
ALTER TABLE users
ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY;
```

PostgreSQL can therefore generate new IDs automatically during `INSERT`.

The identity sequence is also synchronized with existing user IDs.

Important concept:

```text
migration file
    ↓
SQL instructions
    ↓
psql / migration runner
    ↓
PostgreSQL
    ↓
database schema changed
```

A migration file does not modify the database until its SQL is executed.

---

## Request body and streams

HTTP request bodies arrive in Node.js as streams.

The project works with:

```ts
req.on('data', ...)
req.on('end', ...)
req.on('error', ...)
```

Low-level body reading is extracted into:

```ts
readRequestBody(req)
```

This converts the event-based API into a Promise-based API:

```text
request stream
    ↓
chunks
    ↓
end
    ↓
Promise<string>
    ↓
await
```

Controllers can therefore use:

```ts
const body = await readRequestBody(req)
```

---

## Asynchronous flow

PostgreSQL access is an I/O operation.

Because repository methods return Promises, asynchronous execution propagates through the application layers:

```text
Router
  ↓ await
Controller
  ↓ await
Service
  ↓ await
Repository
  ↓ await
PostgreSQL
```

Example:

```text
GET /users/:id
    ↓
getUserByIdController()
    ↓
getUserById()
    ↓
getUserByIdFromDb()
    ↓
db.query()
```

---

## Runtime validation

External JSON is not trusted as a TypeScript type directly.

Instead of:

```ts
const data: CreateUserData = JSON.parse(body)
```

the application uses:

```ts
const data: unknown = JSON.parse(body)
```

The value is then validated at runtime.

Concepts used:

- `unknown`
- `Record<string, unknown>`
- type guards
- type predicates
- type narrowing

Example:

```ts
(data: unknown): data is CreateUserData
```

Validation checks both types and values:

- `name` — non-empty string
- `age` — valid integer
- `email` — basic format validation
- `city` — non-empty string

`PATCH` supports optional fields.

A field may be omitted, but if it is provided, it must be valid.

---

## Query parameters

`GET /users` supports:

```text
city
search
sort
order
page
limit
```

Flow:

```text
URLSearchParams
      ↓
parseGetUsersQuery()
      ↓
validated GetUsersParams
      ↓
service
      ↓
filter / search / sort / pagination
```

At the current stage PostgreSQL returns the users and query processing is performed in Node.js.

Planned improvement:

```text
Node.js processing
      ↓
SQL WHERE / ORDER BY / LIMIT / OFFSET
```

---

## Pagination

The API returns both data and pagination metadata:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 4,
    "totalPages": 1
  }
}
```

Current pagination fields:

```text
page
limit
total
totalPages
```

Pagination is currently calculated in the service layer.

It will later be moved into SQL using:

```sql
LIMIT
OFFSET
```

---

## Error handling

The application has centralized error handling.

A custom error class is used:

```ts
HttpError
```

The router wraps request processing in `try/catch`:

```text
request
   ↓
router
   ↓
controller
   ↓
service
   ↓
repository
   ↓
error
   ↓
handleError()
   ↓
HTTP response
```

Known HTTP errors are returned with their corresponding status codes.

Unexpected internal errors:

- are logged using `console.error`
- return `500 Internal server error`

Internal PostgreSQL error details are not exposed to the client.

---

## Environment variables

Application configuration is separated from business logic.

Environment variables are used for the application and PostgreSQL configuration.

Examples:

```text
PORT
DB_HOST
DB_PORT
DB_NAME
DB_USER
```

Configuration flow:

```text
.env / environment
      ↓
process.env
      ↓
config/env.ts
      ↓
application
```

`.env` loading uses:

```ts
import 'dotenv/config'
```

Development server:

```bash
npm run dev
```

---

## File System

The Node.js File System API was also explored during the project.

Used module:

```ts
node:fs/promises
```

Practiced operations:

- `readFile()`
- `writeFile()`
- `appendFile()`
- `mkdir()`
- `stat()`
- `unlink()`
- `rm()`
- `recursive: true`

The filesystem error:

```text
ENOENT
```

was also examined when accessing missing files or paths.

---

## Main project structure

```text
database/
└── migrations/
    ├── 001_create_users.sql
    └── 002_users_id_identity.sql

src/
├── index.ts
├── server.ts
├── router.ts
│
├── config/
│   └── env.ts
│
├── database/
│   └── db.ts
│
├── shared/
│   ├── errors/
│   │   ├── error-handler.ts
│   │   └── http-error.ts
│   │
│   └── http/
│       ├── request.utils.ts
│       └── response.utils.ts
│
└── users/
    ├── validation/
    │   ├── user.query.ts
    │   └── user.validation.ts
    │
    ├── user.controller.ts
    ├── user.repository.ts
    ├── user.service.ts
    └── user.types.ts
```

The project is gradually evolving toward a feature-based architecture with clear separation of concerns.

---

## Why native Node.js first?

It would be possible to start directly with Express or NestJS.

However, the purpose of this project is to understand what those tools do internally.

For example, request bodies are currently handled through:

```ts
req.on('data', ...)
req.on('end', ...)
```

A framework may later expose something as simple as:

```ts
req.body
```

but the underlying mechanism will already be understood.

The same principle is applied to:

- routing
- validation
- error handling
- configuration
- database access
- repository pattern
- dependency injection
- middleware

---

# Roadmap

## 1. Node.js fundamentals

Completed:

- [x] `node:http`
- [x] HTTP request / response
- [x] asynchronous code
- [x] Promise
- [x] async / await
- [x] streams
- [x] chunks
- [x] ESM modules
- [x] environment variables
- [x] `process.env`
- [x] filesystem
- [x] basic `path`
- [x] filesystem errors

Next:

- [ ] EventEmitter
- [ ] Event Loop in more detail
- [ ] timers
- [ ] deeper Node.js internals

---

## 2. REST API

Completed:

- [x] CRUD
- [x] router
- [x] controllers
- [x] services
- [x] runtime validation
- [x] HTTP status codes
- [x] request body parsing
- [x] URL API
- [x] query parameters
- [x] pagination
- [x] filtering
- [x] search
- [x] sorting
- [x] centralized error handling
- [x] reusable HTTP response helpers

Next:

- [ ] reusable validation schemas
- [ ] Zod
- [ ] more reusable routing
- [ ] move filtering/search/sorting/pagination into SQL

---

## 3. Application architecture

Implemented:

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Repositories
  ↓
Database
```

Completed:

- [x] separation of concerns
- [x] configuration layer
- [x] repository pattern
- [x] feature-based structure
- [x] centralized error handling

Next:

- [ ] dependency injection
- [ ] reusable modules
- [ ] further application architecture improvements

---

## 4. PostgreSQL and SQL

Completed:

- [x] PostgreSQL setup
- [x] `pg`
- [x] connection pool
- [x] repository layer
- [x] users table migration
- [x] identity ID generation
- [x] CRUD migration from memory to PostgreSQL
- [x] `SELECT`
- [x] `INSERT`
- [x] `UPDATE`
- [x] `DELETE`
- [x] `WHERE`
- [x] `ORDER BY`
- [x] primary key
- [x] `UNIQUE`
- [x] `NOT NULL`
- [x] parameterized queries
- [x] migrations

Next:

- [ ] `LIMIT`
- [ ] `OFFSET`
- [ ] SQL filtering
- [ ] SQL search
- [ ] dynamic `ORDER BY`
- [ ] `JOIN`
- [ ] `GROUP BY`
- [ ] indexes in more detail
- [ ] foreign keys
- [ ] relations
- [ ] transactions

---

## 5. NestJS

After understanding the core Node.js mechanisms, rebuild the API using NestJS.

Topics:

- modules
- controllers
- providers
- services
- dependency injection
- DTOs
- pipes
- guards
- interceptors
- exception filters
- configuration

---

## 6. Authentication & Security

Add:

- registration
- authentication
- password hashing
- JWT
- authorization
- roles
- validation
- security basics

---

## 7. Testing

Add:

- unit tests
- integration tests
- API tests
- database integration tests

---

## 8. Docker

Containerize:

```text
Node.js API
    +
PostgreSQL
    +
Docker Compose
```

---

## 9. Fullstack

The final step is connecting the backend to a React/TypeScript frontend.

```text
React
  ↓
REST API
  ↓
Node.js / NestJS
  ↓
PostgreSQL
```

---

## Goal

My goal is to understand the complete application lifecycle:

```text
Frontend
   ↓
HTTP / API
   ↓
Backend
   ↓
Database
   ↓
Infrastructure
```

I want to understand:

- how APIs are designed
- how servers process HTTP requests
- how asynchronous I/O works
- how business logic is structured
- how external input is validated
- how backend applications interact with the filesystem
- how backend applications work with PostgreSQL
- how SQL queries are designed
- how application layers are separated
- how authentication and authorization work
- how applications are tested
- how they are built and deployed to production

The long-term goal is to grow toward **Fullstack / Software Engineering**.
