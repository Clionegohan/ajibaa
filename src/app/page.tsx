"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import RecipeList from "@/components/RecipeList";
import Auth from "@/components/Auth";
import PrefectureFilter from "@/components/PrefectureFilter";
import SearchBar from "@/components/SearchBar";
import { Recipe } from "@/types/recipe";
import { searchRecipes } from "@/lib/search";

// サンプルデータ（Convex接続まではこれを使用）
const sampleRecipes: Recipe[] = [
  {
    _id: "sample-1",
    title: "青森のりんご煮",
    description: "おばあちゃんの優しいりんご煮。甘すぎず、りんごの自然な味を楽しめます。",
    story: "寒い冬の日に、ストーブの上でコトコト煮てくれたおばあちゃん。あの温かい台所の匂いが今でも恋しいです。",
    authorId: "user1",
    authorName: "田中花子",
    prefecture: "青森県",
    category: "おやつ・デザート",
    cookingTime: 30,
    season: ["秋", "冬"],
    tags: ["りんご", "郷土料理", "おばあちゃんの味"],
    ingredients: [
      {
        _id: "ing-1-1",
        recipeId: "sample-1",
        name: "りんご",
        amount: "3",
        unit: "個",
        order: 1
      },
      {
        _id: "ing-1-2",
        recipeId: "sample-1",
        name: "砂糖",
        amount: "大さじ2",
        order: 2
      },
      {
        _id: "ing-1-3",
        recipeId: "sample-1",
        name: "水",
        amount: "50",
        unit: "ml",
        order: 3
      }
    ],
    steps: [
      {
        _id: "step-1-1",
        recipeId: "sample-1",
        stepNumber: 1,
        instruction: "りんごを皮をむいて8等分に切る"
      },
      {
        _id: "step-1-2",
        recipeId: "sample-1",
        stepNumber: 2,
        instruction: "鍋にりんごと砂糖、水を入れて弱火で20分煮る"
      },
      {
        _id: "step-1-3",
        recipeId: "sample-1",
        stepNumber: 3,
        instruction: "りんごが柔らかくなったら完成"
      }
    ],
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
    authorName: "大阪太郎",
    prefecture: "大阪府",
    category: "主食",
    cookingTime: 45,
    tags: ["粉もん", "関西", "ソース"],
    ingredients: [
      {
        _id: "ing-2-1",
        recipeId: "sample-2",
        name: "お好み焼き粉",
        amount: "100",
        unit: "g",
        order: 1
      },
      {
        _id: "ing-2-2",
        recipeId: "sample-2",
        name: "キャベツ",
        amount: "1/4",
        unit: "個",
        order: 2
      },
      {
        _id: "ing-2-3",
        recipeId: "sample-2",
        name: "卵",
        amount: "1",
        unit: "個",
        order: 3
      }
    ],
    steps: [
      {
        _id: "step-2-1",
        recipeId: "sample-2",
        stepNumber: 1,
        instruction: "キャベツを千切りにする"
      },
      {
        _id: "step-2-2",
        recipeId: "sample-2",
        stepNumber: 2,
        instruction: "お好み焼き粉と水、卵を混ぜて生地を作る"
      },
      {
        _id: "step-2-3",
        recipeId: "sample-2",
        stepNumber: 3,
        instruction: "フライパンで両面をこんがり焼く"
      }
    ],
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
    authorName: "北海道次郎",
    prefecture: "北海道",
    category: "副菜",
    cookingTime: 40,
    season: ["通年"],
    tags: ["鶏肉", "北海道", "居酒屋"],
    ingredients: [
      {
        _id: "ing-3-1",
        recipeId: "sample-3",
        name: "鶏もも肉",
        amount: "300",
        unit: "g",
        order: 1
      },
      {
        _id: "ing-3-2",
        recipeId: "sample-3",
        name: "醤油",
        amount: "大さじ2",
        order: 2
      },
      {
        _id: "ing-3-3",
        recipeId: "sample-3",
        name: "片栗粉",
        amount: "適量",
        order: 3
      }
    ],
    steps: [
      {
        _id: "step-3-1",
        recipeId: "sample-3",
        stepNumber: 1,
        instruction: "鶏肉を一口大に切り、醤油で30分漬け込む"
      },
      {
        _id: "step-3-2",
        recipeId: "sample-3",
        stepNumber: 2,
        instruction: "片栗粉をまぶして180度の油で揚げる"
      },
      {
        _id: "step-3-3",
        recipeId: "sample-3",
        stepNumber: 3,
        instruction: "きつね色になったら完成"
      }
    ],
    isPublished: true,
    viewCount: 180,
    likeCount: 32,
    createdAt: Date.now() - 259200000,
    updatedAt: Date.now() - 259200000,
  }
];

export default function Home() {
  const [selectedPrefecture, setSelectedPrefecture] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const hello = useQuery(api.queries.hello);
  const convexRecipes = useQuery(api.queries.getRecipes);
  
  // Convexからデータが取得できればそれを、できなければサンプルデータを使用
  const recipes = convexRecipes && convexRecipes.length > 0 ? convexRecipes : sampleRecipes;
  
  // 検索でフィルタリング
  const searchedRecipes = searchQuery 
    ? searchRecipes(recipes, searchQuery)
    : recipes;
  
  // 都道府県でフィルタリング
  const filteredRecipes = selectedPrefecture 
    ? searchedRecipes.filter(recipe => recipe.prefecture === selectedPrefecture)
    : searchedRecipes;

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
          
          {/* 検索バー */}
          <SearchBar onSearch={setSearchQuery} />
          
          {/* 都道府県フィルター */}
          <PrefectureFilter 
            recipes={recipes}
            selectedPrefecture={selectedPrefecture}
            onFilterChange={setSelectedPrefecture}
          />
          
          {/* フィルター結果の表示 */}
          {(searchQuery || selectedPrefecture) && (
            <div className="mb-4 p-3 bg-wa-orange/10 rounded-lg">
              <p className="text-sm text-wa-charcoal">
                {searchQuery && (
                  <>
                    🔍 "<strong>{searchQuery}</strong>" の検索結果: {searchedRecipes.length}件
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="ml-2 text-wa-orange hover:underline text-sm"
                    >
                      検索を解除
                    </button>
                  </>
                )}
                {searchQuery && selectedPrefecture && " | "}
                {selectedPrefecture && (
                  <>
                    📍 <strong>{selectedPrefecture}</strong>でフィルター: {filteredRecipes.length}件
                    <button 
                      onClick={() => setSelectedPrefecture("")}
                      className="ml-2 text-wa-orange hover:underline text-sm"
                    >
                      フィルターを解除
                    </button>
                  </>
                )}
              </p>
            </div>
          )}
          
          <RecipeList recipes={filteredRecipes} />
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