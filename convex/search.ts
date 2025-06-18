// @ts-nocheck
import { query } from "./_generated/server";
import { v } from "convex/values";

// 高度な検索機能
export const searchRecipes = query({
  args: {
    query: v.optional(v.string()),
    prefecture: v.optional(v.string()),
    category: v.optional(v.string()),
    season: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    cookingTimeMax: v.optional(v.number()),
    sortBy: v.optional(v.union(
      v.literal("latest"),
      v.literal("popular"),
      v.literal("mostLiked"),
      v.literal("cookingTime")
    )),
    limit: v.optional(v.number()),
  },
  handler: async (ctx: any, args: any) => {
    const {
      query: searchQuery,
      prefecture,
      category,
      season,
      tags,
      cookingTimeMax,
      sortBy = "latest",
      limit = 20
    } = args;

    // ベースクエリ（公開されたレシピのみ）
    let recipesQuery = ctx.db
      .query("recipes")
      .filter((q: any) => q.eq(q.field("isPublished"), true));

    // テキスト検索（タイトル・説明・ストーリーから検索）
    if (searchQuery && searchQuery.trim()) {
      const searchTerm = searchQuery.trim().toLowerCase();
      recipesQuery = recipesQuery.filter((q) =>
        q.or(
          q.gte(q.field("title"), searchTerm),
          q.gte(q.field("description"), searchTerm),
          q.gte(q.field("story"), searchTerm)
        )
      );
    }

    // 都道府県フィルタ
    if (prefecture) {
      recipesQuery = recipesQuery.filter((q) => 
        q.eq(q.field("prefecture"), prefecture)
      );
    }

    // カテゴリフィルタ
    if (category) {
      recipesQuery = recipesQuery.filter((q) => 
        q.eq(q.field("category"), category)
      );
    }

    // 調理時間フィルタ
    if (cookingTimeMax) {
      recipesQuery = recipesQuery.filter((q) => 
        q.lte(q.field("cookingTime"), cookingTimeMax)
      );
    }

    // ソート順
    switch (sortBy) {
      case "popular":
        recipesQuery = recipesQuery.order("desc").take(limit);
        break;
      case "mostLiked":
        recipesQuery = recipesQuery.order("desc").take(limit);
        break;
      case "cookingTime":
        recipesQuery = recipesQuery.order("asc").take(limit);
        break;
      case "latest":
      default:
        recipesQuery = recipesQuery.order("desc").take(limit);
        break;
    }

    const recipes = await recipesQuery.collect();

    // 季節・タグでの追加フィルタリング（クライアントサイド）
    let filteredRecipes = recipes;

    if (season) {
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.season?.includes(season)
      );
    }

    if (tags && tags.length > 0) {
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.tags?.some(tag => tags.includes(tag))
      );
    }

    // 材料と手順の情報も含める
    const recipesWithDetails = await Promise.all(
      filteredRecipes.map(async (recipe) => {
        const ingredients = await ctx.db
          .query("recipeIngredients")
          .filter((q) => q.eq(q.field("recipeId"), recipe._id))
          .order("asc")
          .collect();

        const steps = await ctx.db
          .query("recipeSteps")
          .filter((q) => q.eq(q.field("recipeId"), recipe._id))
          .order("asc")
          .collect();

        return {
          ...recipe,
          ingredients,
          steps,
        };
      })
    );

    return recipesWithDetails;
  },
});

// 人気のレシピ取得
export const getPopularRecipes = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { limit = 10 } = args;
    
    const recipes = await ctx.db
      .query("recipes")
      .filter((q) => q.eq(q.field("isPublished"), true))
      .order("desc")
      .take(limit)
      .collect();

    return recipes;
  },
});

// 新着レシピ取得
export const getLatestRecipes = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { limit = 10 } = args;
    
    const recipes = await ctx.db
      .query("recipes")
      .filter((q) => q.eq(q.field("isPublished"), true))
      .order("desc")
      .take(limit)
      .collect();

    return recipes;
  },
});

// いいね数順のレシピ取得
export const getMostLikedRecipes = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { limit = 10 } = args;
    
    const recipes = await ctx.db
      .query("recipes")
      .filter((q) => q.eq(q.field("isPublished"), true))
      .order("desc")
      .take(limit)
      .collect();

    return recipes;
  },
});

// 都道府県別レシピ統計
export const getRecipeStatsByPrefecture = query({
  args: {},
  handler: async (ctx) => {
    const recipes = await ctx.db
      .query("recipes")
      .filter((q) => q.eq(q.field("isPublished"), true))
      .collect();

    const stats = recipes.reduce((acc, recipe) => {
      const prefecture = recipe.prefecture;
      if (!acc[prefecture]) {
        acc[prefecture] = 0;
      }
      acc[prefecture]++;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(stats)
      .map(([prefecture, count]) => ({ prefecture, count }))
      .sort((a, b) => b.count - a.count);
  },
});

// カテゴリ別レシピ統計
export const getRecipeStatsByCategory = query({
  args: {},
  handler: async (ctx) => {
    const recipes = await ctx.db
      .query("recipes")
      .filter((q) => q.eq(q.field("isPublished"), true))
      .collect();

    const stats = recipes.reduce((acc, recipe) => {
      const category = recipe.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category]++;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(stats)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  },
});

// タグクラウド用のタグ統計
export const getPopularTags = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { limit = 20 } = args;
    
    const recipes = await ctx.db
      .query("recipes")
      .filter((q) => q.eq(q.field("isPublished"), true))
      .collect();

    const tagCounts = recipes.reduce((acc, recipe) => {
      if (recipe.tags) {
        recipe.tags.forEach(tag => {
          acc[tag] = (acc[tag] || 0) + 1;
        });
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  },
});

// 関連レシピ取得（同じ都道府県・カテゴリ・タグから）
export const getRelatedRecipes = query({
  args: {
    recipeId: v.id("recipes"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { recipeId, limit = 6 } = args;
    
    const recipe = await ctx.db.get(recipeId);
    if (!recipe) return [];

    // 同じ都道府県、カテゴリ、タグを持つレシピを検索
    const relatedRecipes = await ctx.db
      .query("recipes")
      .filter((q) => 
        q.and(
          q.eq(q.field("isPublished"), true),
          q.neq(q.field("_id"), recipeId),
          q.or(
            q.eq(q.field("prefecture"), recipe.prefecture),
            q.eq(q.field("category"), recipe.category)
          )
        )
      )
      .order("desc")
      .take(limit)
      .collect();

    return relatedRecipes;
  },
});