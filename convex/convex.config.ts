import { defineApp } from "convex/server";

// Phase 1: 認証機能を簡素化してアプリケーション設定
const app = defineApp();

// Phase 2で認証機能を統合予定
// import auth from "./auth.config.js";
// app.use(auth);

export default app;