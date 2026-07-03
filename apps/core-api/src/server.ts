import { buildCoreApi } from "./app";

const port = Number(process.env.CORE_API_PORT ?? 4000);
const app = buildCoreApi();

await app.listen({ port, host: "0.0.0.0" });
