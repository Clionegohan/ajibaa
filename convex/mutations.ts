import { mutation } from "./_generated/server";
import { v } from "convex/values";

// レシピ作成 (Phase 1: 認証スキップ版)
export const createRecipe = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    story: v.optional(v.string()),
    prefecture: v.string(),
    category: v.string(),
    cookingTime: v.number(),
    season: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
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
    // Phase 1: 認証をスキップして基本機能をテスト
    // Phase 2で認証機能を完全統合予定
    
    // 一時的にテストユーザーを使用
    const tempUserId = "temp-user-id" as any;
    const tempUserName = "テストユーザー";
    
    // レシピを作成
    const recipeId = await ctx.db.insert("recipes", {
      title: args.title,
      description: args.description,
      story: args.story,
      authorId: tempUserId,
      authorName: tempUserName,
      prefecture: args.prefecture,
      category: args.category,
      cookingTime: args.cookingTime,
      season: args.season,
      tags: args.tags,
      isPublished: true,
      viewCount: 0,
      likeCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // 材料を保存
    for (let i = 0; i < args.ingredients.length; i++) {
      const ingredient = args.ingredients[i];
      await ctx.db.insert("recipeIngredients", {
        recipeId,
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        note: ingredient.note,
        order: i + 1,
      });
    }

    // 手順を保存
    for (let i = 0; i < args.steps.length; i++) {
      const step = args.steps[i];
      await ctx.db.insert("recipeSteps", {
        recipeId,
        stepNumber: i + 1,
        instruction: step.instruction,
        tips: step.tips,
      });
    }
    
    return recipeId;
  },
});

// いいね機能 (Phase 1: 認証スキップ版)
export const toggleLike = mutation({
  args: {
    recipeId: v.id("recipes"),
  },
  handler: async (ctx, args) => {
    // Phase 1: 認証をスキップして基本機能をテスト
    // Phase 2で認証機能を完全統合予定
    
    const tempUserId = "temp-user-id" as any;
    const { recipeId } = args;
    
    // 既存のいいねレコードを検索
    const existingLike = await ctx.db
      .query("likes")
      .filter((q) => 
        q.and(
          q.eq(q.field("userId"), tempUserId),
          q.eq(q.field("recipeId"), recipeId)
        )
      )
      .first();

    if (existingLike) {
      // いいね済みなら削除
      await ctx.db.delete(existingLike._id);
      
      // レシピのlikeCountを減らす
      const recipe = await ctx.db.get(recipeId);
      if (recipe) {
        await ctx.db.patch(recipeId, {
          likeCount: Math.max(0, recipe.likeCount - 1)
        });
      }
      
      return { liked: false, message: "いいねを取り消しました" };
    } else {
      // 未いいねなら追加
      await ctx.db.insert("likes", {
        userId: tempUserId,
        recipeId,
        createdAt: Date.now(),
      });
      
      // レシピのlikeCountを増やす
      const recipe = await ctx.db.get(recipeId);
      if (recipe) {
        await ctx.db.patch(recipeId, {
          likeCount: recipe.likeCount + 1
        });
      }
      
      return { liked: true, message: "いいねしました" };
    }
  },
});

// コメント機能
export const addComment = mutation({
  args: {
    recipeId: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // TODO: 認証機能実装後に有効化
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) throw new Error("認証が必要です");
    
    const userId = "temp-user-id"; // 認証実装後に実際のユーザーIDに変更
    const { recipeId, content } = args;
    
    console.log("Add comment requested:", { recipeId, content, userId });
    
    // TODO: 実際のコメント機能実装
    // 1. コメントをデータベースに保存
    // 2. 投稿者の名前を取得
    // 3. リアルタイム更新
    
    // 開発中のメッセージ
    console.log("コメント機能は開発中です");
    
    return { success: true };
  },
});

// レシピ更新
export const updateRecipe = mutation({
  args: {
    id: v.string(),
    title: v.string(),
    description: v.string(),
    story: v.optional(v.string()),
    prefecture: v.string(),
    category: v.string(),
    difficulty: v.number(),
    cookingTime: v.number(),
    servings: v.number(),
    tags: v.optional(v.array(v.string())),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    // TODO: 認証機能実装後に有効化
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) throw new Error("認証が必要です");
    
    const { id, ...updateData } = args;
    
    console.log("Recipe update requested:", { id, updateData });
    
    // TODO: 実際のDB更新処理
    // await ctx.db.patch(id as Id<"recipes">, {
    //   ...updateData,
    //   updatedAt: Date.now(),
    // });
    
    // 開発中のメッセージ
    console.log("レシピ更新機能は開発中です");
    
    return { success: true };
  },
});

// レシピ削除
export const deleteRecipe = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    // TODO: 認証機能実装後に有効化
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) throw new Error("認証が必要です");
    
    const { id } = args;
    
    console.log("Recipe delete requested:", { id });
    
    // TODO: 実際のDB削除処理
    // 1. 権限確認（作成者のみ削除可能）
    // 2. レシピ削除
    // 3. 関連データ（コメント、いいね）も削除
    // await ctx.db.delete(id as Id<"recipes">);
    
    // 開発中のメッセージ
    console.log("レシピ削除機能は開発中です");
    
    return { success: true };
  },
});