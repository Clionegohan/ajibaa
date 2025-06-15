## 📁 `.claude/database-migrations.md`

### データベース移行戦略

#### スキーマ変更管理
```typescript
// スキーマバージョン管理
export const schemaVersions = defineTable({
  version: v.string(),
  description: v.string(),
  appliedAt: v.number(),
  rollbackScript: v.optional(v.string()),
})
.index("by_version", ["version"]);

// マイグレーション実行記録
export const migrations = defineTable({
  migrationId: v.string(),
  name: v.string(),
  appliedAt: v.number(),
  success: v.boolean(),
  errorMessage: v.optional(v.string()),
})
.index("by_migration_id", ["migrationId"]);
```

#### データ移行スクリプト
```typescript
// 既存レシピデータのカテゴリ正規化
export const normalizeRecipeCategories = mutation({
  handler: async (ctx) => {
    const recipes = await ctx.db.query("recipes").collect();
    
    const categoryMapping = {
      "ごはんもの": "主食",
      "おかず": "副菜", 
      "スープ": "汁物",
      "お菓子": "おやつ・デザート",
    };
    
    for (const recipe of recipes) {
      if (recipe.category in categoryMapping) {
        await ctx.db.patch(recipe._id, {
          category: categoryMapping[recipe.category as keyof typeof categoryMapping],
          updatedAt: Date.now(),
        });
      }
    }
  },
});

// 都道府県データの正規化
export const normalizePrefectureData = mutation({
  handler: async (ctx) => {
    const recipes = await ctx.db.query("recipes").collect();
    
    for (const recipe of recipes) {
      // "青森" → "青森県" の正規化
      if (!recipe.prefecture.endsWith("県") && 
          !recipe.prefecture.endsWith("府") && 
          !recipe.prefecture.endsWith("都") && 
          recipe.prefecture !== "北海道") {
        await ctx.db.patch(recipe._id, {
          prefecture: recipe.prefecture + "県",
          updatedAt: Date.now(),
        });
      }
    }
  },
});
```

#### バックアップ・復旧戦略
```typescript
// データエクスポート
export const exportRecipeData = query({
  args: { includeUnpublished: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    let recipes = await ctx.db.query("recipes");
    
    if (!args.includeUnpublished) {
      recipes = recipes.filter(q => q.eq(q.field("isPublished"), true));
    }
    
    const recipeData = await recipes.collect();
    
    // 関連データも取得
    const ingredientsData = await ctx.db.query("recipeIngredients").collect();
    const stepsData = await ctx.db.query("recipeSteps").collect();
    
    return {
      recipes: recipeData,
      ingredients: ingredientsData,
      steps: stepsData,
      exportedAt: Date.now(),
      version: "1.0",
    };
  },
});

// データインポート
export const importRecipeData = mutation({
  args: {
    data: v.object({
      recipes: v.array(v.any()),
      ingredients: v.array(v.any()),
      steps: v.array(v.any()),
    }),
  },
  handler: async (ctx, args) => {
    // バックアップからのデータ復旧処理
    // 実装は慎重に行う必要がある
    throw new Error("Not implemented - requires careful implementation");
  },
});
```

---

## 📁 `.claude/database-security.md`

### セキュリティ設定

#### Row Level Security (RLS)
```typescript
// convex/auth.config.ts
export default {
  providers: [
    GoogleOAuth,
    // その他のプロバイダー
  ],
  callbacks: {
    afterUserCreatedOrUpdated(ctx, { existingUser, user }) {
      if (existingUser) {
        // 既存ユーザーのログイン時間更新
        return ctx.db.patch(existingUser._id, {
          lastLoginAt: Date.now(),
        });
      }
      // 新規ユーザー作成
      return ctx.db.insert("users", {
        email: user.email,
        name: user.name ?? "名無し",
        role: "user",
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    },
  },
};
```

#### データアクセス制御
```typescript
// 管理者権限チェック
async function requireAdmin(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("認証が必要です");
  
  const user = await ctx.db
    .query("users")
    .filter(q => q.eq(q.field("email"), identity.email))
    .first();
  
  if (!user || user.role !== "admin") {
    throw new Error("管理者権限が必要です");
  }
  
  return user;
}

// 投稿者本人チェック
async function requireOwnerOrAdmin(ctx: any, recipeId: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("認証が必要です");
  
  const user = await ctx.db
    .query("users")
    .filter(q => q.eq(q.field("email"), identity.email))
    .first();
  
  if (!user) throw new Error("ユーザーが見つかりません");
  
  const recipe = await ctx.db.get(recipeId);
  if (!recipe) throw new Error("レシピが見つかりません");
  
  if (recipe.authorId !== user._id && user.role !== "admin") {
    throw new Error("編集権限がありません");
  }
  
  return { user, recipe };
}

// 使用例
export const deleteRecipe = mutation({
  args: { recipeId: v.id("recipes") },
  handler: async (ctx, args) => {
    const { user, recipe } = await requireOwnerOrAdmin(ctx, args.recipeId);
    
    // レシピと関連データを削除
    await ctx.db.delete(args.recipeId);
    
    // 関連する材料・手順も削除
    const ingredients = await ctx.db
      .query("recipeIngredients")
      .filter(q => q.eq(q.field("recipeId"), args.recipeId))
      .collect();
    
    for (const ingredient of ingredients) {
      await ctx.db.delete(ingredient._id);
    }
    
    const steps = await ctx.db
      .query("recipeSteps")
      .filter(q => q.eq(q.field("recipeId"), args.recipeId))
      .collect();
    
    for (const step of steps) {
      await ctx.db.delete(step._id);
    }
  },
});
```

#### 入力値検証
```typescript
// バリデーション関数
const validateRecipeInput = (input: any) => {
  if (!input.title || input.title.length < 1 || input.title.length > 100) {
    throw new Error("タイトルは1-100文字で入力してください");
  }
  
  if (!input.description || input.description.length < 10) {
    throw new Error("説明は10文字以上入力してください");
  }
  
  if (input.difficulty < 1 || input.difficulty > 5) {
    throw new Error("難易度は1-5の範囲で入力してください");
  }
  
  if (input.cookingTime < 1 || input.cookingTime > 600) {
    throw new Error("調理時間は1-600分の範囲で入力してください");
  }
  
  // XSS対策：HTMLタグの除去
  input.title = input.title.replace(/<[^>]*>/g, '');
  input.description = input.description.replace(/<[^>]*>/g, '');
  input.story = input.story.replace(/<[^>]*>/g, '');
  
  return input;
};

// 使用例
export const createRecipeSecure = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    // ... その他のフィールド
  },
  handler: async (ctx, args) => {
    // 認証チェック
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("認証が必要です");
    
    // 入力値検証
    const validatedInput = validateRecipeInput(args);
    
    // レシピ作成処理
    // ...
  },
});
```
