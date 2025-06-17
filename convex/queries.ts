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
  args: { recipeId: v.id("recipes") },
  handler: async (ctx, { recipeId }) => {
    const recipe = await ctx.db.get(recipeId);
    
    if (!recipe) {
      return null;
    }

    // 材料を取得
    const ingredients = await ctx.db
      .query("recipeIngredients")
      .filter((q) => q.eq(q.field("recipeId"), recipeId))
      .order("order")
      .collect();

    // 作り方を取得
    const steps = await ctx.db
      .query("recipeSteps")
      .filter((q) => q.eq(q.field("recipeId"), recipeId))
      .order("stepNumber")
      .collect();

    return {
      ...recipe,
      ingredients,
      steps,
    };
  },
});

// ユーザープロフィール取得
export const getUserProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    // TODO: 実際のユーザーデータを取得
    // 今はnullを返してローディング状態をテスト
    return null;
  },
});