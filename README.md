# Learning Node.js

🇷🇺 [Русская версия](#ru) | 🇬🇧 [English version](#en)

---

<a id="ru"></a>

# 🇷🇺 Русская версия

## О проекте

Этот репозиторий — мой учебный backend-проект на **Node.js + TypeScript**.

Моя основная специализация — frontend-разработка на React/TypeScript. Цель проекта — последовательно расширить знания в сторону backend и fullstack-разработки и разобраться не только в использовании готовых фреймворков, но и в том, как серверная часть приложения работает на более низком уровне.

Поэтому первые этапы реализуются на чистом Node.js через `node:http`, без Express и NestJS.

Такой подход позволяет сначала разобраться с:

- HTTP
- request / response lifecycle
- routing
- streams
- Promise / async-await
- runtime validation
- environment variables
- filesystem
- обработкой ошибок
- разделением приложения на слои

а уже затем переходить к более высокоуровневым инструментам.

---

## Текущий этап

На текущем этапе реализован простой REST API для работы с пользователями.

### Endpoints

```text
GET     /users
GET     /users/:id
POST    /users
PATCH   /users/:id
DELETE  /users/:id
```

Данные пока хранятся в памяти приложения в обычном массиве.

Позже этот слой будет заменён PostgreSQL.

---

## Что уже реализовано

### HTTP и REST

- HTTP-сервер через `node:http`
- CRUD для пользователей
- получение `id` из URL
- HTTP status codes
- обработка `400` и `404`
- JSON parsing
- request body через Node.js stream

### Архитектура

HTTP-логика постепенно разделена на отдельные слои:

```text
HTTP request
      ↓
server / routing
      ↓
controller
      ↓
runtime validation
      ↓
service
      ↓
data
```

Контроллер отвечает за HTTP:

- request / response
- status codes
- чтение body
- JSON parsing
- вызов validation
- вызов service

Service layer содержит бизнес-логику и не зависит от HTTP.

---

## Request body и streams

Тело HTTP-запроса читается через stream:

```ts
req.on('data', ...)
req.on('end', ...)
req.on('error', ...)
```

Низкоуровневая логика чтения body вынесена в отдельную функцию:

```ts
readRequestBody(req)
```

Она преобразует event-based API Node.js в Promise-based API:

```text
request stream
      ↓
data chunks
      ↓
end
      ↓
Promise<string>
      ↓
await
```

Благодаря этому контроллер может работать с body более линейно:

```ts
const body = await readRequestBody(req)
```

---

## Runtime validation

Внешний JSON не приводится напрямую к TypeScript-типам.

Вместо:

```ts
const data: CreateUserData = JSON.parse(body)
```

используется:

```ts
const data: unknown = JSON.parse(body)
```

После этого данные проходят runtime validation.

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

Проверяются не только типы, но и значения:

- `name` — непустая строка
- `age` — целое число в допустимом диапазоне
- `email` — базовая проверка формата
- `city` — непустая строка

Для `PATCH` учитываются optional-поля.

Переданное поле должно быть валидным, но передавать все поля одновременно не требуется.

---

## Environment variables

Конфигурация сервера больше не должна быть полностью захардкожена в коде.

Порт читается через:

```ts
process.env.PORT
```

с fallback:

```ts
3000
```

Пример запуска:

```bash
PORT=4000 npx tsx src/server.ts
```

Также протестирована загрузка переменных из `.env`:

```bash
npx tsx --env-file=.env src/server.ts
```

Используются:

```text
PORT
NODE_ENV
```

Принцип:

```text
environment
      ↓
process.env
      ↓
application configuration
```

Один и тот же код может запускаться с разной конфигурацией в:

- development
- test
- production

---

## File System

Для изучения Node.js File System API добавлен отдельный учебный сценарий.

Используется:

```ts
node:fs/promises
```

Разобраны:

- `readFile()` — чтение файла
- `writeFile()` — запись / перезапись
- `appendFile()` — добавление данных
- `mkdir()` — создание директории
- `stat()` — metadata файла или директории
- `unlink()` — удаление файла
- `rm()` — удаление директории
- `recursive: true` — работа с вложенной структурой

Пример:

```ts
const message = await readFile(
	'./src/data/message.txt',
	'utf-8',
)
```

Также разобрана системная ошибка:

```text
ENOENT
```

которая возникает при обращении к отсутствующему файлу или пути.

---

## Текущая структура проекта

```text
src/
├── server.ts
├── fs-demo.ts
│
├── data/
│   └── message.txt
│
├── shared/
│   └── http/
│       └── request.utils.ts
│
└── users/
    ├── user.controller.ts
    ├── user.service.ts
    ├── user.types.ts
    ├── user.validation.ts
    └── user.data.ts
```

Структура постепенно развивается в сторону feature-based организации.

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

- откуда body появляется
- что такое stream
- что такое chunk
- когда завершается чтение запроса
- почему операции являются асинхронными

Та же идея применяется к:

- validation
- routing
- error handling
- dependency injection
- database access
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
- [ ] более системная обработка ошибок

---

## 2. REST API

Уже реализовано:

- [x] CRUD
- [x] controllers
- [x] services
- [x] runtime validation
- [x] HTTP status codes
- [x] request body parsing

Следующие этапы:

- [ ] улучшенный routing
- [ ] URL API
- [ ] query parameters
- [ ] pagination
- [ ] filtering
- [ ] sorting
- [ ] centralized error handling
- [ ] reusable validation schemas
- [ ] Zod

---

## 3. Архитектура приложения

Постепенно развить приложение до структуры:

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

Разобрать:

- separation of concerns
- dependency injection
- configuration layer
- reusable modules
- application architecture
- repository pattern

---

## 4. PostgreSQL и SQL

Заменить массив пользователей настоящей базой данных.

Изучить:

- PostgreSQL
- SQL
- `SELECT`
- `INSERT`
- `UPDATE`
- `DELETE`
- `WHERE`
- `JOIN`
- `GROUP BY`
- `ORDER BY`
- indexes
- primary keys
- foreign keys
- relations
- transactions
- migrations

---

## 5. NestJS

После понимания базовых механизмов Node.js перенести API на NestJS.

Разобрать:

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
- как сервер обрабатывает запросы
- как работает асинхронность
- как устроена бизнес-логика
- как приложение валидирует внешние данные
- как backend работает с файловой системой
- как приложение работает с базой данных
- как устроена authentication / authorization
- как приложение тестируется
- как оно собирается и запускается в production

Итоговая цель — развитие в направлении **Fullstack / Software Engineering**.

---

<a id="en"></a>

# 🇬🇧 English version

## About

This repository is my backend learning project built with **Node.js + TypeScript**.

My main background is frontend development with React and TypeScript.

The purpose of this project is to gradually expand my knowledge into backend and fullstack development and understand not only how backend frameworks are used, but also how server-side applications work internally.

For this reason, the first stages are implemented using native Node.js with `node:http`, without Express or NestJS.

This approach helps me understand:

- HTTP
- request / response lifecycle
- routing
- streams
- Promise / async-await
- runtime validation
- environment variables
- filesystem
- error handling
- application layers

before moving to higher-level frameworks.

---

## Current stage

The project currently contains a simple REST API for users.

### Endpoints

```text
GET     /users
GET     /users/:id
POST    /users
PATCH   /users/:id
DELETE  /users/:id
```

Data is currently stored in memory using a simple array.

It will later be replaced with PostgreSQL.

---

## Current implementation

### HTTP and REST

Implemented:

- HTTP server using `node:http`
- users CRUD operations
- URL parameter parsing
- HTTP status codes
- `400` and `404` error handling
- JSON parsing
- request body reading through streams

### Architecture

HTTP logic is gradually being separated into dedicated layers:

```text
HTTP request
      ↓
server / routing
      ↓
controller
      ↓
runtime validation
      ↓
service
      ↓
data
```

Controllers are responsible for HTTP concerns:

- request / response
- status codes
- request body
- JSON parsing
- validation
- service invocation

The service layer contains business logic and does not depend on HTTP.

---

## Request body and streams

HTTP request bodies are read through Node.js streams:

```ts
req.on('data', ...)
req.on('end', ...)
req.on('error', ...)
```

Low-level request body parsing was extracted into:

```ts
readRequestBody(req)
```

The utility converts an event-based API into a Promise-based API:

```text
request stream
      ↓
data chunks
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

Validation checks both field types and values:

- `name` — non-empty string
- `age` — integer within the allowed range
- `email` — basic format validation
- `city` — non-empty string

`PATCH` validation supports optional fields.

A field may be omitted, but if it is provided, it must be valid.

---

## Environment variables

Server configuration is no longer fully hardcoded.

The port can be read from:

```ts
process.env.PORT
```

with a fallback:

```ts
3000
```

Example:

```bash
PORT=4000 npx tsx src/server.ts
```

Variables can also be loaded from `.env`:

```bash
npx tsx --env-file=.env src/server.ts
```

Currently practiced:

```text
PORT
NODE_ENV
```

The configuration flow is:

```text
environment
      ↓
process.env
      ↓
application configuration
```

The same application code can therefore run with different configuration in:

- development
- test
- production

---

## File System

A separate learning scenario was added for the Node.js File System API.

The project uses:

```ts
node:fs/promises
```

Practiced operations:

- `readFile()` — read file contents
- `writeFile()` — write / overwrite files
- `appendFile()` — append data
- `mkdir()` — create directories
- `stat()` — inspect file and directory metadata
- `unlink()` — delete files
- `rm()` — delete directories
- `recursive: true` — recursive directory operations

Example:

```ts
const message = await readFile(
	'./src/data/message.txt',
	'utf-8',
)
```

The filesystem error:

```text
ENOENT
```

was also examined when accessing a missing file.

---

## Current project structure

```text
src/
├── server.ts
├── fs-demo.ts
│
├── data/
│   └── message.txt
│
├── shared/
│   └── http/
│       └── request.utils.ts
│
└── users/
    ├── user.controller.ts
    ├── user.service.ts
    ├── user.types.ts
    ├── user.validation.ts
    └── user.data.ts
```

The project is gradually moving toward a feature-based structure.

---

## Why native Node.js first?

It would be possible to start directly with Express or NestJS.

However, the goal of this project is to understand what these tools do internally.

For example, the request body is currently handled using:

```ts
req.on('data', ...)
req.on('end', ...)
```

A framework may later expose something as simple as:

```ts
req.body
```

but by that point the underlying mechanism will already be understood.

The same principle will be applied to:

- validation
- routing
- error handling
- dependency injection
- database access
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
- [ ] structured error handling

---

## 2. REST API

Already implemented:

- [x] CRUD
- [x] controllers
- [x] services
- [x] runtime validation
- [x] HTTP status codes
- [x] request body parsing

Next:

- [ ] improved routing
- [ ] URL API
- [ ] query parameters
- [ ] pagination
- [ ] filtering
- [ ] sorting
- [ ] centralized error handling
- [ ] reusable validation schemas
- [ ] Zod

---

## 3. Application architecture

Gradually evolve the project into:

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

Topics:

- separation of concerns
- dependency injection
- configuration layer
- reusable modules
- application architecture
- repository pattern

---

## 4. PostgreSQL and SQL

Replace the in-memory users array with a real database.

Topics:

- PostgreSQL
- SQL
- `SELECT`
- `INSERT`
- `UPDATE`
- `DELETE`
- `WHERE`
- `JOIN`
- `GROUP BY`
- `ORDER BY`
- indexes
- primary keys
- foreign keys
- relations
- transactions
- migrations

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

---

## 8. Docker

Containerize the application:

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
- how servers process requests
- how asynchronous I/O works
- how business logic is structured
- how external input is validated
- how backend applications interact with the filesystem
- how applications interact with databases
- how authentication and authorization work
- how applications are tested
- how they are built and deployed to production

The long-term goal is to grow toward **Fullstack / Software Engineering**.
