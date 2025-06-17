import { query } from "./_generated/server";
import { v } from "convex/values";

// テスト用のシンプルなクエリ
export const hello = query({
  handler: async () => {
    return "味ばあへようこそ！";
  },
});

// レシピ一覧取得
export const getRecipes = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
    prefecture: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let recipesQuery = ctx.db.query("recipes")
      .filter((q) => q.eq(q.field("isPublished"), true))
      .order("desc");

    // 都道府県フィルタ
    if (args.prefecture) {
      recipesQuery = recipesQuery.filter((q) => 
        q.eq(q.field("prefecture"), args.prefecture!)
      );
    }

    // カテゴリフィルタ
    if (args.category) {
      recipesQuery = recipesQuery.filter((q) => 
        q.eq(q.field("category"), args.category!)
      );
    }

    const recipes = await recipesQuery
      .take(args.limit || 20);

    return recipes;
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