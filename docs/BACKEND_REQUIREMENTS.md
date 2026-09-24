### Backend Project Foundation

Create the backend project inside the existing `backend/` folder.

### Technology

Use:

```text
Node.js
TypeScript
Express
```

Do not add PostgreSQL, Prisma, MongoDB, authentication, or any database yet.

### Requirements

Create a clean, scalable backend structure suitable for an enterprise starter kit.

Use this conceptual structure:

```text
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── repositories/
│   ├── models/
│   ├── utils/
│   └── app.ts
│
├── package.json
├── tsconfig.json
└── README.md
```

Adapt the structure to the existing project conventions if necessary.

### Initial API

Create:

```text
GET /api/health
```

Response:

```json
{
  "status": "ok"
}
```

The server should start successfully using a simple npm script.

### Configuration

Use environment variables for configuration such as:

```text
PORT
NODE_ENV
```

Provide a `.env.example` file.

Do not commit real `.env` files.

### Code Quality

Use strict TypeScript.

Avoid `any` unless genuinely required.

Separate:

```text
Routes
Controllers
Services
Repositories
```

Do not put business logic directly inside route definitions.

Create a centralized Express application setup.

Add appropriate error handling middleware.

Add a basic 404 handler.

Add a basic request logging mechanism if it fits naturally without introducing unnecessary dependencies.

### Scripts

Provide appropriate npm scripts for:

```text
dev
build
start
lint
```

Use a development setup that supports TypeScript development without requiring manual compilation for every change.

### Important

First inspect the existing repository structure before making changes.

Do not modify the existing frontend.

Do not introduce a database.

Do not implement authentication or RBAC yet.

Do not overengineer the backend.

Actually create the files and implement the working backend.

After implementation:

1. Install dependencies if required.
2. Run the TypeScript build.
3. Run lint.
4. Start the server.
5. Verify `GET /api/health` works.

At the end, provide a concise summary of files created, commands available, and verification performed.
