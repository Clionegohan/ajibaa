import { defineApp } from "convex/server";
import { convexAuth } from "@convex-dev/auth/server";

const app = defineApp();
app.use(convexAuth);
export default app;