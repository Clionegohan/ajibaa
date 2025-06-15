頻繁に使用するコマンドパターン
開発環境起動
bash# Convex開発サーバー起動
npx convex dev

# Next.js開発サーバー起動
npm run dev

# 並行起動（推奨）
npm run dev:all
Convex関連操作
bash# スキーママイグレーション
npx convex dev

# 関数デプロイ
npx convex deploy

# データベースリセット（開発時のみ）
npx convex dashboard
Git操作パターン
bash# 機能開発開始
git checkout -b feature/recipe-posting
git checkout -b feature/prefecture-map
git checkout -b feature/realtime-comments

# 開発完了
git add .
git commit -m "feat: レシピ投稿機能実装"
git push origin feature/recipe-posting
定型的な実装テンプレート
Convexクエリ関数
typescriptexport const getRecipesByPrefecture = query({
  args: {
    prefecture: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("recipes")
      .filter(q => q.and(
        q.eq(q.field("prefecture"), args.prefecture),
        q.eq(q.field("isPublished"), true)
      ))
      .order("desc")
      .take(args.limit ?? 20);
  },
});
ミューテーション関数
typescriptexport const createRecipe = mutation({
  args: {
    title: v.string(),
    prefecture: v.string(),
    // ... other fields
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    
    // ユーザー確認
    const user = await getUserByIdentity(ctx, identity);
    
    // レシピ作成
    const recipeId = await ctx.db.insert("recipes", {
      ...args,
      authorId: user._id,
      isPublished: true,
      viewCount: 0,
      likeCount: 0,
    });
    
    return recipeId;
  },
});
React コンポーネントパターン
typescript"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface RecipeListProps {
  prefecture?: string;
}

export function RecipeList({ prefecture }: RecipeListProps) {
  const recipes = useQuery(api.recipes.getRecipes, {
    prefecture,
  });

  if (recipes === undefined) {
    return <LoadingSpinner />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
}
エラーハンドリングパターン
typescript// Convex関数内
try {
  const result = await someOperation();
  return result;
} catch (error) {
  console.error("Operation failed:", error);
  throw new Error("Operation failed");
}

// React コンポーネント内
const recipes = useQuery(api.recipes.getRecipes, {
  prefecture: "青森県",
});

if (recipes === undefined) return <Loading />;
if (recipes === null) return <Error message="データの取得に失敗しました" />;
