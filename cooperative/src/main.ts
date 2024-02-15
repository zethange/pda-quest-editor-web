import { Elysia } from "elysia";
import { registerStoryRoutes } from "./story";
import { cors } from "@elysiajs/cors";
import { registerAuthRoutes } from "./auth";
import { registerEchoRoutes } from "./echo";

const PORT = process.env.PORT || 3000;
const app = new Elysia().use(cors());
app.use(registerStoryRoutes());
app.use(registerAuthRoutes());
app.use(registerEchoRoutes());

app.listen(3000);
console.log(`🚀 Server ready at http://localhost:${PORT}`);
