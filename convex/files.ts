// @ts-nocheck
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// 画像アップロードURL生成
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    // 認証チェック（Phase 2.2で有効化予定）
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) {
    //   throw new Error("認証が必要です");
    // }
    
    // アップロードURLを生成
    return await ctx.storage.generateUploadUrl();
  },
});

// 画像情報保存
export const saveImage = mutation({
  args: {
    storageId: v.id("_storage"),
    name: v.string(),
    type: v.string(),
    size: v.number(),
  },
  handler: async (ctx, args) => {
    // 認証チェック（Phase 2.2で有効化予定）
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) {
    //   throw new Error("認証が必要です");
    // }

    const { storageId, name, type, size } = args;
    
    // 画像URLを取得
    const url = await ctx.storage.getUrl(storageId);
    if (!url) {
      throw new Error("画像の取得に失敗しました");
    }

    // 画像情報をデータベースに保存（オプション）
    // const imageRecord = await ctx.db.insert("images", {
    //   storageId,
    //   name,
    //   type,
    //   size,
    //   url,
    //   uploadedAt: Date.now(),
    //   userId: user._id, // Phase 2.2で有効化
    // });

    return {
      storageId,
      url,
      name,
      type,
      size,
    };
  },
});

// 画像削除
export const deleteImage = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    // 認証チェック（Phase 2.2で有効化予定）
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) {
    //   throw new Error("認証が必要です");
    // }

    const { storageId } = args;
    
    try {
      // ストレージから画像を削除
      await ctx.storage.delete(storageId);
      
      // データベースレコードも削除（オプション）
      // const imageRecord = await ctx.db
      //   .query("images")
      //   .filter((q) => q.eq(q.field("storageId"), storageId))
      //   .first();
      
      // if (imageRecord) {
      //   await ctx.db.delete(imageRecord._id);
      // }
      
      return { success: true };
    } catch (error) {
      console.error("画像削除エラー:", error);
      throw new Error("画像の削除に失敗しました");
    }
  },
});

// 画像URL取得
export const getImageUrl = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const { storageId } = args;
    
    const url = await ctx.storage.getUrl(storageId);
    if (!url) {
      throw new Error("画像が見つかりません");
    }
    
    return { url };
  },
});

// ユーザーの画像一覧取得（Phase 2.2で有効化予定）
export const getUserImages = query({
  args: {},
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) {
    //   return [];
    // }

    // const user = await ctx.db
    //   .query("users")
    //   .filter((q) => q.eq(q.field("email"), identity.email!))
    //   .first();

    // if (!user) {
    //   return [];
    // }

    // const images = await ctx.db
    //   .query("images")
    //   .filter((q) => q.eq(q.field("userId"), user._id))
    //   .order("desc")
    //   .take(50);

    // return images;
    
    // Phase 2.2まで空配列を返す
    return [];
  },
});