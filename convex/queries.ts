import { query } from "./_generated/server";
import { v } from "convex/values";

// テスト用のシンプルなクエリ
export const hello = query({
  handler: async () => {
    return "味ばあへようこそ！";
  },
});

// レシピ一覧取得（今後実装予定）
export const getRecipes = query({
  handler: async (ctx) => {
    // TODO: 実際のレシピデータを取得
    return [];
  },
});

// レシピ詳細取得
export const getRecipeById = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    // TODO: 実際のレシピデータを取得
    // 今はnullを返してローディング状態をテスト
    return null;
  },
});