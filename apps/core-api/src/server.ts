import { buildCoreApi } from "./app";

const port = Number(process.env.CORE_API_PORT ?? 4000);
const host = process.env.CORE_API_HOST ?? "::";
const app = buildCoreApi();

await app.listen({ port, host });
