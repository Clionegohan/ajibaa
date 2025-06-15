import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ユーザー情報
  users: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("user"), v.literal("admin")),
    prefecture: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
    lastLoginAt: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_prefecture", ["prefecture"]),

  // レシピ情報
  recipes: defineTable({
    title: v.string(),
    description: v.string(),
    story: v.optional(v.string()), // おばあちゃんの思い出話
    authorId: v.id("users"),
    prefecture: v.string(),
    category: v.string(), // 主食、副菜、汁物、おやつ・デザート等
    difficulty: v.number(), // 1-5の難易度
    cookingTime: v.number(), // 分
    servings: v.number(), // 人分
    season: v.optional(v.array(v.string())), // 春、夏、秋、冬
    tags: v.optional(v.array(v.string())),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    isPublished: v.boolean(),
    viewCount: v.number(),
    likeCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_author", ["authorId"])
    .index("by_prefecture", ["prefecture"])
    .index("by_category", ["category"])
    .index("by_published", ["isPublished"])
    .index("by_likes", ["likeCount"])
    .index("by_views", ["viewCount"])
    .index("by_created", ["createdAt"]),

  // レシピの材料
  recipeIngredients: defineTable({
    recipeId: v.id("recipes"),
    name: v.string(),
    amount: v.string(),
    unit: v.optional(v.string()),
    note: v.optional(v.string()),
    order: v.number(),
  }).index("by_recipe", ["recipeId"]),

  // レシピの手順
  recipeSteps: defineTable({
    recipeId: v.id("recipes"),
    stepNumber: v.number(),
    instruction: v.string(),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    tips: v.optional(v.string()),
  }).index("by_recipe", ["recipeId"]),

  // いいね
  likes: defineTable({
    userId: v.id("users"),
    recipeId: v.id("recipes"),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_recipe", ["recipeId"])
    .index("by_user_recipe", ["userId", "recipeId"]),

  // コメント
  comments: defineTable({
    userId: v.id("users"),
    recipeId: v.id("recipes"),
    content: v.string(),
    parentId: v.optional(v.id("comments")), // 返信コメント用
    isPublished: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_recipe", ["recipeId"])
    .index("by_user", ["userId"])
    .index("by_parent", ["parentId"]),

  // 都道府県マスタ
  prefectures: defineTable({
    name: v.string(),
    region: v.string(), // 北海道・東北、関東等
    specialties: v.optional(v.array(v.string())), // 特産品
    description: v.optional(v.string()),
    recipeCount: v.number(),
  }).index("by_region", ["region"]),
});