# Backend

this is the machine of the app. It is a Node.js, Express, TypeScript, Prisma, PostgreSQL monorepo.

I started with layers, dependency injection in container, error handling, jwt cookie auth, transactions, and deadlock prevention.

jwt cookie auth is a way to authenticate users using JSON Web Tokens stored in an httpOnly cookie. the server generates the token, sends to client, sends back to server and verifies it.

transactions is a sequence of operations that are treated as a single unit. either all operations succeed, or none of them do.

deadlock is when two or more transactions are waiting for each other to release locks, and thus neither can proceed.

for example, the request comes in, the route comes between middleware and the controller. then checks the cookie before reaching the controller, which calls the service, then repo, that talks to the database, and if there is any error, error handler will come up in the same format.


we used this backend architecture because it is easy to maintain, test, and scale. it is also easy to understand and follow.

