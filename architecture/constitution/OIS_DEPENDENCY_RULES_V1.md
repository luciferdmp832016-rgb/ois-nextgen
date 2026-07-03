# OIS Dependency Rules V1

Allowed direction:

Product Shell -> Product API/BFF -> Domain Service -> Core Capability -> Repository -> Database

Forbidden:

- Frontend importing Prisma.
- Product Runtime importing OIS Console.
- Database access from React page code.
- Circular domain imports.
- Product Shell owning platform governance.
- Broad legacy permissions such as `page:intelligence`.

The local `pnpm lint` command runs an architecture guard for practical Stage A enforcement.
