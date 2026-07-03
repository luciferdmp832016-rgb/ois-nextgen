# Core API Rules

- Expose explicit API contracts and generated OpenAPI docs.
- API handlers may call domain services, repositories and Prisma-backed adapters.
- Validate inbound payloads with Zod.
- Apply tenant context before reading or writing scoped records.
- Audit sensitive writes.
