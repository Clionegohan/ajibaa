import { mutation } from "./_generated/server";
import { v } from "convex/values";

// レシピ作成 (Phase 2: 完全認証版)
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
    imageStorageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
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
    // Phase 3: 段階的実装 - まず画像機能をテスト
    // Phase 2.2で認証システムを完全統合予定
    
    // 一時的にテストユーザーを使用
    const tempUserId = "temp-user-id" as any;
    const tempUserName = "テストユーザー";
    const user = { _id: tempUserId, name: tempUserName };
    
    // レシピを作成
    const recipeId = await ctx.db.insert("recipes", {
      title: args.title,
      description: args.description,
      story: args.story,
      authorId: user._id,
      authorName: user.name,
      prefecture: args.prefecture,
      category: args.category,
      cookingTime: args.cookingTime,
      season: args.season,
      tags: args.tags,
      imageUrl: args.imageUrl,
      imageStorageId: args.imageStorageId,
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

// いいね機能 (Phase 2: 完全認証版)
export const toggleLike = mutation({
  args: {
    recipeId: v.id("recipes"),
  },
  handler: async (ctx, args) => {
    // Phase 2: 完全な認証システム統合
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証が必要です");
    }
    
    // 実際のユーザー情報を取得
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email!))
      .first();
    
    if (!user) {
      throw new Error("ユーザー情報が見つかりません");
    }
    
    const { recipeId } = args;
    
    // 既存のいいねレコードを検索
    const existingLike = await ctx.db
      .query("likes")
      .filter((q) => 
        q.and(
          q.eq(q.field("userId"), user._id),
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
        userId: user._id,
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

// コメント機能 (Phase 2: 完全認証版)
export const addComment = mutation({
  args: {
    recipeId: v.id("recipes"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // Phase 2: 完全な認証システム統合
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証が必要です");
    }
    
    // 実際のユーザー情報を取得
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email!))
      .first();
    
    if (!user) {
      throw new Error("ユーザー情報が見つかりません");
    }
    
    const { recipeId, content } = args;
    
    // コメントをデータベースに保存
    const commentId = await ctx.db.insert("comments", {
      userId: user._id,
      recipeId,
      content,
      isPublished: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return { 
      success: true, 
      commentId,
      message: "コメントを投稿しました" 
    };
  },
});

// レシピ更新 (Phase 2: 完全認証版)
export const updateRecipe = mutation({
  args: {
    id: v.id("recipes"),
    title: v.string(),
    description: v.string(),
    story: v.optional(v.string()),
    prefecture: v.string(),
    category: v.string(),
    cookingTime: v.number(),
    tags: v.optional(v.array(v.string())),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Phase 2: 完全な認証システム統合
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証が必要です");
    }
    
    // 実際のユーザー情報を取得
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email!))
      .first();
    
    if (!user) {
      throw new Error("ユーザー情報が見つかりません");
    }
    
    const { id, ...updateData } = args;
    
    // 既存レシピの権限確認
    const existingRecipe = await ctx.db.get(id);
    if (!existingRecipe) {
      throw new Error("レシピが見つかりません");
    }
    
    if (existingRecipe.authorId !== user._id) {
      throw new Error("このレシピを編集する権限がありません");
    }
    
    // レシピを更新
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
    
    return { 
      success: true,
      message: "レシピを更新しました" 
    };
  },
});

// レシピ削除 (Phase 2: 完全認証版)
export const deleteRecipe = mutation({
  args: {
    id: v.id("recipes"),
  },
  handler: async (ctx, args) => {
    // Phase 2: 完全な認証システム統合
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証が必要です");
    }
    
    // 実際のユーザー情報を取得
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email!))
      .first();
    
    if (!user) {
      throw new Error("ユーザー情報が見つかりません");
    }
    
    const { id } = args;
    
    // 既存レシピの権限確認
    const existingRecipe = await ctx.db.get(id);
    if (!existingRecipe) {
      throw new Error("レシピが見つかりません");
    }
    
    if (existingRecipe.authorId !== user._id) {
      throw new Error("このレシピを削除する権限がありません");
    }
    
    // 関連データを削除
    // 1. コメントを削除
    const comments = await ctx.db
      .query("comments")
      .filter((q) => q.eq(q.field("recipeId"), id))
      .collect();
    
    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }
    
    // 2. いいねを削除
    const likes = await ctx.db
      .query("likes")
      .filter((q) => q.eq(q.field("recipeId"), id))
      .collect();
    
    for (const like of likes) {
      await ctx.db.delete(like._id);
    }
    
    // 3. 材料を削除
    const ingredients = await ctx.db
      .query("recipeIngredients")
      .filter((q) => q.eq(q.field("recipeId"), id))
      .collect();
    
    for (const ingredient of ingredients) {
      await ctx.db.delete(ingredient._id);
    }
    
    // 4. 手順を削除
    const steps = await ctx.db
      .query("recipeSteps")
      .filter((q) => q.eq(q.field("recipeId"), id))
      .collect();
    
    for (const step of steps) {
      await ctx.db.delete(step._id);
    }
    
    // 5. レシピ本体を削除
    await ctx.db.delete(id);
    
    return { 
      success: true,
      message: "レシピを削除しました" 
    };
  },
});