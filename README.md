# Senai GPT Web (Angular)

Angular web application for user authentication and AI-powered chat, consuming an API hosted on Azure. Includes login and signup screens, chat list, message exchange, and dark mode. Project deployed on Vercel.

## Project Link

* Access: [https://senai-gpt-angular-two.vercel.app/login](https://senai-gpt-angular-two.vercel.app/login)

### Test User

* Email: [front@email.com](mailto:front@email.com)
* Password: frontdomina

## Demo

<img height="939" alt="image" src="https://github.com/user-attachments/assets/734545ca-b16e-4e97-9946-5f0b323d5bfa" />

## Technologies

* Angular 20 (standalone components)
* TypeScript 5.8
* Angular Router (routes + `CanActivate` guard)
* Reactive Forms (login/sign-up)
* HttpClient + Interceptor (401 handling)
* RxJS 7.8
* Tests: Jasmine + Karma
* Deploy: Vercel (frontend) | Azure App Service (backend)

## Features

* Authentication with token stored in `localStorage` (`meuToken`, `meuId`).
* Route protection for `/chat` via guard (`src/app/auth.guard.ts`).
* Chat with conversation list and messages persisted through the API.
* Calls to `/chat-completion` to fetch AI responses (Gemini model via backend).
* Dark mode with preference saved in `localStorage`.

## Backend Endpoints

Base URL: `https://senai-gpt-api.azurewebsites.net`

* `POST /login` – authentication
* `POST /users` – user registration
* `GET /chats`, `POST /chats`, `DELETE /chats/:id`
* `GET /messages?chatId=...`, `POST /messages`, `DELETE /messages/:id`
* `POST /chat-completion` – AI response

## Requirements

* Node.js 18.19+ (20.x recommended)
* npm 9+

## How to Run Locally

1. Install dependencies:

```
npm install
```

2. Start the development server:

```
npm run start
```

3. Open `http://localhost:4200/`.

Tips:

* Create a user at `/new-user` and log in at `/login` to access `/chat`.
* The token is automatically stored in `localStorage` after login.

## Build

```
npm run build
```

Artifacts will be generated in `dist/` according to `angular.json`.

## Available Scripts

* `npm start` – `ng serve` (dev)
* `npm run build` – production build
* `npm run watch` – watch mode
* `npm test` – unit tests (Karma + Jasmine)

## Structure (Summary)

* `src/app/app.routes.ts` – route definitions
* `src/app/auth.guard.ts` – auth guard
* `src/app/user-module/login-screen/` – login screen
* `src/app/user-module/new-user-screen/` – sign-up screen
* `src/app/chat-module/chat-screen/` – chat screen + `chat-service.ts`
* `src/app/interfaces/gemini-response.ts` – AI response types

## Notes

* The API URL is hardcoded in `chat-service.ts` and login logic; adjust if using multiple environments.
* The interceptor redirects to `/login` on `401` and clears `localStorage`.
