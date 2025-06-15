"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import RecipeList from "@/components/RecipeList";
import Auth from "@/components/Auth";
import { Recipe } from "@/types/recipe";

// サンプルデータ（Convex接続まではこれを使用）
const sampleRecipes: Recipe[] = [
  {
    _id: "sample-1",
    title: "青森のりんご煮",
    description: "おばあちゃんの優しいりんご煮。甘すぎず、りんごの自然な味を楽しめます。",
    story: "寒い冬の日に、ストーブの上でコトコト煮てくれたおばあちゃん。あの温かい台所の匂いが今でも恋しいです。",
    authorId: "user1",
    prefecture: "青森県",
    category: "おやつ・デザート",
    difficulty: 2,
    cookingTime: 30,
    servings: 4,
    season: ["秋", "冬"],
    tags: ["りんご", "郷土料理", "おばあちゃんの味"],
    isPublished: true,
    viewCount: 150,
    likeCount: 23,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
  },
  {
    _id: "sample-2",
    title: "大阪のお好み焼き",
    description: "関西風の本格お好み焼き。ふわふわの生地とたっぷりキャベツが自慢です。",
    authorId: "user2",
    prefecture: "大阪府",
    category: "主食",
    difficulty: 3,
    cookingTime: 45,
    servings: 2,
    tags: ["粉もん", "関西", "ソース"],
    isPublished: true,
    viewCount: 200,
    likeCount: 45,
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 172800000,
  },
  {
    _id: "sample-3",
    title: "北海道のザンギ",
    description: "北海道民のソウルフード。醤油ベースの下味がきいた唐揚げです。",
    story: "札幌の居酒屋で初めて食べた時の感動が忘れられません。",
    authorId: "user3",
    prefecture: "北海道",
    category: "副菜",
    difficulty: 3,
    cookingTime: 40,
    servings: 3,
    season: ["通年"],
    tags: ["鶏肉", "北海道", "居酒屋"],
    isPublished: true,
    viewCount: 180,
    likeCount: 32,
    createdAt: Date.now() - 259200000,
    updatedAt: Date.now() - 259200000,
  }
];

export default function Home() {
  const hello = useQuery(api.queries.hello);
  const convexRecipes = useQuery(api.queries.getRecipes);
  
  // Convexからデータが取得できればそれを、できなければサンプルデータを使用
  const recipes = convexRecipes && convexRecipes.length > 0 ? convexRecipes : sampleRecipes;

  return (
    <main className="min-h-screen bg-wa-cream">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-wa-charcoal text-center mb-4">
          味ばあ
        </h1>
        <p className="text-lg text-wa-charcoal text-center mb-8">
          おばあちゃんの味を次世代へ
        </p>
        
        {/* 認証セクション */}
        <section className="mb-8">
          <Auth />
        </section>
        
        {/* レシピ投稿リンク */}
        <section className="mb-12 text-center">
          <a
            href="/recipes/new"
            className="inline-block px-6 py-3 wa-paper wa-border bg-wa-orange text-white font-semibold rounded-lg 
                     hover:bg-wa-orange/80 transition-all shadow-lg"
          >
            ✏️ レシピを投稿する
          </a>
        </section>
        
        {/* レシピ一覧 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-wa-charcoal mb-6">
            🍽️ みんなのレシピ
          </h2>
          <RecipeList recipes={recipes} />
        </section>
        
        {/* Convex接続テスト（開発用） */}
        <div className="text-center mt-8 p-4 wa-paper wa-border opacity-70">
          <h3 className="text-lg font-semibold mb-2">開発状況</h3>
          <p className="text-sm text-wa-charcoal">
            {hello ? `✅ ${hello}` : "⏳ Convex接続中..."}
          </p>
          <p className="text-sm text-wa-charcoal mt-1">
            データソース: {convexRecipes ? 'Convex' : 'サンプルデータ'}
          </p>
        </div>
      </div>
    </main>
  )
}