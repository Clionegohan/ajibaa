// @ts-nocheck
import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";

// レシピのコメント一覧取得
export const getRecipeComments = query({
  args: {
    recipeId: v.id("recipes"),
  },
  handler: async (ctx: any, args: any) => {
    const { recipeId } = args;
    
    // コメントを作成日時順で取得
    const comments = await ctx.db
      .query("comments")
      .filter((q: any) => 
        q.and(
          q.eq(q.field("recipeId"), recipeId),
          q.eq(q.field("isPublished"), true)
        )
      )
      .order("desc")
      .collect();

    // ユーザー情報を含めた形でコメントを返す
    const commentsWithUsers = await Promise.all(
      comments.map(async (comment: any) => {
        // Phase 3: 段階的実装 - まずコメント基本機能をテスト
        // Phase 2.2で認証システム統合時にユーザー情報を取得
        
        // 一時的にテストユーザー情報を使用
        const userInfo = {
          _id: comment.userId,
          name: "テストユーザー",
          email: "test@example.com",
        };

        return {
          ...comment,
          user: userInfo,
          createdAtFormatted: new Date(comment.createdAt).toLocaleString("ja-JP", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
      })
    );

    return commentsWithUsers;
  },
});

// コメント追加
export const addComment = mutation({
  args: {
    recipeId: v.id("recipes"),
    content: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    // Phase 3: 段階的実装 - まずコメント機能をテスト
    // Phase 2.2で認証システムを完全統合予定
    
    // 一時的にテストユーザーを使用
    const tempUserId = "temp-user-id" as any;
    const { recipeId, content } = args;
    
    // 入力検証
    if (!content.trim()) {
      throw new Error("コメント内容を入力してください");
    }
    
    if (content.length > 500) {
      throw new Error("コメントは500文字以内で入力してください");
    }
    
    // コメントをデータベースに保存
    const commentId = await ctx.db.insert("comments", {
      userId: tempUserId,
      recipeId,
      content: content.trim(),
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

// コメント削除
export const deleteComment = mutation({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    // Phase 3: 段階的実装 - まずコメント機能をテスト
    // Phase 2.2で認証システムを完全統合予定
    
    const tempUserId = "temp-user-id" as any;
    const { commentId } = args;
    
    // コメント取得
    const comment = await ctx.db.get(commentId);
    if (!comment) {
      throw new Error("コメントが見つかりません");
    }
    
    // 権限確認（作成者のみ削除可能）
    if (comment.userId !== tempUserId) {
      throw new Error("このコメントを削除する権限がありません");
    }
    
    // コメント削除
    await ctx.db.delete(commentId);
    
    return { 
      success: true,
      message: "コメントを削除しました" 
    };
  },
});

// コメント編集
export const updateComment = mutation({
  args: {
    commentId: v.id("comments"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // Phase 3: 段階的実装 - まずコメント機能をテスト
    // Phase 2.2で認証システムを完全統合予定
    
    const tempUserId = "temp-user-id" as any;
    const { commentId, content } = args;
    
    // 入力検証
    if (!content.trim()) {
      throw new Error("コメント内容を入力してください");
    }
    
    if (content.length > 500) {
      throw new Error("コメントは500文字以内で入力してください");
    }
    
    // コメント取得
    const comment = await ctx.db.get(commentId);
    if (!comment) {
      throw new Error("コメントが見つかりません");
    }
    
    // 権限確認（作成者のみ編集可能）
    if (comment.userId !== tempUserId) {
      throw new Error("このコメントを編集する権限がありません");
    }
    
    // コメント更新
    await ctx.db.patch(commentId, {
      content: content.trim(),
      updatedAt: Date.now(),
    });
    
    return { 
      success: true,
      message: "コメントを更新しました" 
    };
  },
});

// コメント数取得
export const getCommentCount = query({
  args: {
    recipeId: v.id("recipes"),
  },
  handler: async (ctx, args) => {
    const { recipeId } = args;
    
    const count = await ctx.db
      .query("comments")
      .filter((q) => 
        q.and(
          q.eq(q.field("recipeId"), recipeId),
          q.eq(q.field("isPublished"), true)
        )
      )
      .collect()
      .then((comments) => comments.length);
    
    return { count };
  },
});