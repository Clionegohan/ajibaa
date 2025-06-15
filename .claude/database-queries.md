
## 📁 `.claude/database-queries.md`

### よく使用するクエリパターン

#### レシピ検索クエリ
```typescript
// convex/queries/recipes.ts

// 都道府県別レシピ取得
export const getRecipesByPrefecture = query({
  args: {
    prefecture: v.string(),
    category: v.optional(v.string()),
    season: v.optional(v.string()),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db
      .query("recipes")
      .filter(q => q.and(
        q.eq(q.field("prefecture"), args.prefecture),
        q.eq(q.field("isPublished"), true)
      ));

    if (args.category) {
      q = q.filter(q => q.eq(q.field("category"), args.category));
    }

    if (args.season) {
      q = q.filter(q => q.eq(q.field("seasons"), args.season));
    }

    const recipes = await q
      .order("desc")
      .paginate({
        numItems: args.limit ?? 20,
        cursor: args.cursor ?? null,
      });

    return recipes;
  },
});

// 人気レシピ取得
export const getPopularRecipes = query({
  args: {
    period: v.optional(v.string()), // week, month, all
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // 人気度スコア計算（いいね数 × 0.7 + 閲覧数 × 0.3）
    const recipes = await ctx.db
      .query("recipes")
      .filter(q => q.eq(q.field("isPublished"), true))
      .collect();

    const recipesWithScore = recipes.map(recipe => ({
      ...recipe,
      popularityScore: recipe.likeCount * 0.7 + recipe.viewCount * 0.3
    }));

    return recipesWithScore
      .sort((a, b) => b.popularityScore - a.popularityScore)
      .slice(0, args.limit ?? 20);
  },
});

// 検索機能
export const searchRecipes = query({
  args: {
    searchTerm: v.string(),
    filters: v.optional(v.object({
      prefecture: v.optional(v.string()),
      category: v.optional(v.string()),
      difficulty: v.optional(v.number()),
    })),
  },
  handler: async (ctx, args) => {
    let results = await ctx.db
      .query("recipes")
      .withSearchIndex("search_recipes", q => 
        q.search("title", args.searchTerm)
      )
      .filter(q => q.eq(q.field("isPublished"), true))
      .collect();

    if (args.filters?.prefecture) {
      results = results.filter(r => r.prefecture === args.filters!.prefecture);
    }

    if (args.filters?.category) {
      results = results.filter(r => r.category === args.filters!.category);
    }

    if (args.filters?.difficulty) {
      results = results.filter(r => r.difficulty <= args.filters!.difficulty!);
    }

    return results;
  },
});
```

#### ユーザー関連クエリ
```typescript
// ユーザープロフィール取得
export const getUserProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    // ユーザーの投稿レシピ数
    const recipeCount = await ctx.db
      .query("recipes")
      .filter(q => q.and(
        q.eq(q.field("authorId"), args.userId),
        q.eq(q.field("isPublished"), true)
      ))
      .collect()
      .then(recipes => recipes.length);

    // フォロワー数
    const followerCount = await ctx.db
      .query("follows")
      .filter(q => q.eq(q.field("followeeId"), args.userId))
      .collect()
      .then(follows => follows.length);

    // フォロー数
    const followingCount = await ctx.db
      .query("follows")
      .filter(q => q.eq(q.field("followerId"), args.userId))
      .collect()
      .then(follows => follows.length);

    return {
      ...user,
      recipeCount,
      followerCount,
      followingCount,
    };
  },
});
```

#### 統計関連クエリ
```typescript
// 都道府県別統計取得
export const getPrefectureStats = query({
  handler: async (ctx) => {
    const stats = await ctx.db.query("prefectureStats").collect();
    const prefectures = await ctx.db.query("prefectures").collect();

    return prefectures.map(pref => {
      const stat = stats.find(s => s.prefecture === pref.name);
      return {
        ...pref,
        recipeCount: stat?.recipeCount ?? 0,
        totalViews: stat?.totalViews ?? 0,
        totalLikes: stat?.totalLikes ?? 0,
        contributorCount: stat?.contributorCount ?? 0,
      };
    });
  },
});

// 日次統計取得
export const getDailyStats = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("dailyStats")
      .filter(q => q.and(
        q.gte(q.field("date"), args.startDate),
        q.lte(q.field("date"), args.endDate)
      ))
      .order("asc")
      .collect();
  },
});
```

---

