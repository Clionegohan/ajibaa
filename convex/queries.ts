import { query } from "./_generated/server";

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