# Learning Node.js

🇷🇺 [Русская версия](#ru) | 🇬🇧 [English version](#en)

---
<a id="#ru"></a>
# 🇷🇺 Русская версия

## О проекте

Этот репозиторий — мой учебный проект по backend-разработке на **Node.js + TypeScript**.

Моя основная специализация — frontend-разработка на React/TypeScript. Цель этого проекта — последовательно расширить знания в сторону backend и fullstack-разработки, разобраться не только в использовании готовых фреймворков, но и в том, как работает серверная часть приложения на более низком уровне.

Поэтому первые этапы проекта реализуются на чистом Node.js через `node:http`, без Express и NestJS.

Это позволяет разобраться с HTTP, request/response lifecycle, маршрутизацией, JSON, status codes, streams и обработкой ошибок до перехода к более высокоуровневым инструментам.

---

## Что реализовано

На текущем этапе реализован простой REST API для работы с пользователями.

### Endpoints

text
GET     /users
GET     /users/:id
POST    /users
PATCH   /users/:id
DELETE  /users/:id


Реализовано:

HTTP-сервер на node:http
CRUD-операции для пользователей
получение параметров из URL
чтение request body через stream
JSON parsing
HTTP status codes
обработка ошибок 400 и 404
разделение HTTP-логики и бизнес-логики
типизация через TypeScript
отдельные типы User, CreateUserData и UpdateUserData
ESM-модули
базовая структура service layer

Текущая структура

src/
├── server.ts
├── users.ts
├── user.service.ts
└── index.ts


Основная идея разделения:

HTTP request
      ↓
server / routing
      ↓
service
      ↓
data

На текущем этапе данные хранятся в памяти приложения в обычном массиве.

Позже этот слой будет заменён настоящей базой данных.


Зачем сначала чистый Node.js

Можно сразу использовать Express или NestJS, но моя цель — понимать, что происходит под капотом.

Например, сейчас я вручную работаю с:

req.on('data', ...)
req.on('end', ...)

и понимаю, как Node.js получает HTTP body через stream.

Позже во фреймворке можно будет написать:

req.body

но уже понимать, какую работу фреймворк выполняет за меня.


План развития
1. Node.js fundamentals
HTTP
Event Loop
asynchronous code
Promise / async-await
streams
events
modules
filesystem
environment variables
error handling
2. REST API
routing
controllers
services
DTO
validation
HTTP status codes
centralized error handling
query parameters
pagination
filtering
sorting
3. Архитектура приложения

Постепенно разделить приложение на слои:


Routes
  ↓
Controllers
  ↓
Services
  ↓
Repositories
  ↓
Database

Разобраться с:

separation of concerns
dependency injection
configuration
reusable modules
application architecture


4. PostgreSQL и SQL

Перейти от массива пользователей к настоящей базе данных.

Изучить и использовать:

PostgreSQL
SELECT / INSERT / UPDATE / DELETE
WHERE
JOIN
GROUP BY
ORDER BY
indexes
primary / foreign keys
relations
transactions
migrations
5. NestJS

После понимания базовых механизмов Node.js перенести API на NestJS.

План:

modules
controllers
providers
services
dependency injection
DTO
pipes
guards
interceptors
exception filters
configuration
6. Authentication & Security

Добавить:

registration
authentication
password hashing
JWT
authorization
roles
validation
security basics
7. Testing

Добавить:

unit tests
integration tests
API tests
8. Docker

Контейнеризировать приложение:


Node.js API
+
PostgreSQL
+
Docker Compose


9. Fullstack

Финальная цель — связать backend с frontend-приложением на React/TypeScript.


React
   ↓
REST API
   ↓
NestJS / Node.js
   ↓
PostgreSQL


Цель

Моя цель — перейти от frontend-разработки к пониманию полного жизненного цикла приложения:


Frontend
   ↓
HTTP / API
   ↓
Backend
   ↓
Database
   ↓
Infrastructure


Я хочу уметь не только создавать пользовательский интерфейс, но и понимать:

как проектируется API
как сервер обрабатывает запросы
как устроена бизнес-логика
как приложение работает с базой данных
как устроена авторизация
как приложение тестируется
как оно собирается и запускается в production

Итоговая цель — развитие в направлении Fullstack / Software Engineering.
--------------------------------------------------------------------------------

<a id="#en"></a>
🇬🇧 English version

About

This repository is my learning project for backend development with Node.js and TypeScript.

My main background is frontend development with React and TypeScript.

The purpose of this project is to gradually expand my knowledge into backend and fullstack development and understand not only how backend frameworks are used, but also how server-side applications work internally.

For this reason, the first stages are implemented using native Node.js with node:http, without Express or NestJS.

This helps me understand HTTP, request/response lifecycle, routing, JSON, status codes, streams, and error handling before moving to higher-level frameworks.

Current implementation

The project currently contains a simple REST API for users.

Endpoints

GET     /users
GET     /users/:id
POST    /users
PATCH   /users/:id
DELETE  /users/:id



Implemented:

HTTP server using node:http
users CRUD operations
URL parameter parsing
request body reading using streams
JSON parsing
HTTP status codes
400 and 404 error handling
separation between HTTP and business logic
TypeScript typing
User, CreateUserData, and UpdateUserData types
ESM modules
basic service layer

Current project structure

src/
├── server.ts
├── users.ts
├── user.service.ts
└── index.ts

Current application flow:

HTTP request
      ↓
server / routing
      ↓
service
      ↓
data

At the moment, data is stored in memory using a simple array.

It will later be replaced with a real database.

Why native Node.js first?

It would be possible to start directly with Express or NestJS, but my goal is to understand what happens under the hood.

For example, I currently work directly with:

req.on('data', ...)
req.on('end', ...)

to understand how Node.js receives an HTTP request body through streams.

Later, frameworks may provide something as simple as:

req.body

but I will already understand what the framework is doing for me.

Roadmap

1. Node.js fundamentals
HTTP
Event Loop
asynchronous programming
Promise / async-await
streams
events
modules
filesystem
environment variables
error handling

2. REST API
routing
controllers
services
DTOs
validation
HTTP status codes
centralized error handling
query parameters
pagination
filtering
sorting

3. Application architecture

Gradually evolve the project into layered architecture:

Routes
  ↓
Controllers
  ↓
Services
  ↓
Repositories
  ↓
Database

Topics:

separation of concerns
dependency injection
configuration
reusable modules
application architecture

4. PostgreSQL and SQL

Replace the in-memory users array with a real database.

Topics:

PostgreSQL
SELECT / INSERT / UPDATE / DELETE
WHERE
JOIN
GROUP BY
ORDER BY
indexes
primary / foreign keys
relations
transactions
migrations

5. NestJS

After understanding the basic Node.js mechanisms, rebuild the API using NestJS.

Topics:

modules
controllers
providers
services
dependency injection
DTOs
pipes
guards
interceptors
exception filters
configuration

6. Authentication & Security

Add:

registration
authentication
password hashing
JWT
authorization
roles
validation
security basics

7. Testing

Add:

unit tests
integration tests
API tests

8. Docker

Containerize the application:

Node.js API
+
PostgreSQL
+
Docker Compose

9. Fullstack

The final step is connecting the backend with a React/TypeScript frontend.

React
   ↓
REST API
   ↓
NestJS / Node.js
   ↓
PostgreSQL
Goal

My goal is to understand the complete application lifecycle:

Frontend
   ↓
HTTP / API
   ↓
Backend
   ↓
Database
   ↓
Infrastructure

I want to understand not only how to build user interfaces, but also:

how APIs are designed
how servers process requests
how business logic is structured
how applications interact with databases
how authentication and authorization work
how applications are tested
how they are built and deployed to production

The long-term goal is to grow towards Fullstack / Software Engineering.


```
