import { mutation } from "./_generated/server";
import { v } from "convex/values";

// レシピ作成 (将来実装予定)
export const createRecipe = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    story: v.optional(v.string()),
    prefecture: v.string(),
    category: v.string(),
    difficulty: v.number(),
    cookingTime: v.number(),
    servings: v.number(),
    ingredients: v.array(v.object({
      name: v.string(),
      amount: v.string(),
      unit: v.optional(v.string()),
      note: v.optional(v.string()),
    })),
    steps: v.array(v.object({
      instruction: v.string(),
      tips: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    // TODO: 認証機能実装後に有効化
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) throw new Error("認証が必要です");
    
    console.log("Recipe creation requested:", args);
    
    // 実際のDB保存処理
    const recipeId = await ctx.db.insert("recipes", {
      ...args,
      authorId: "temp-user-id", // 認証実装後に実際のユーザーIDに変更
      isPublished: true,
      viewCount: 0,
      likeCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return recipeId;
  },
});