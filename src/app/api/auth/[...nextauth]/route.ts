import { convexAuth } from "@convex-dev/auth/server";
import { NextRequest } from "next/server";

const { GET, POST } = convexAuth({
  providers: [],
});

export { GET, POST };