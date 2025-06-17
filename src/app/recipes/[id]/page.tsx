'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import RecipeDetail from '@/components/RecipeDetail';
import { notFound } from 'next/navigation';
import { Recipe } from '@/types/recipe';

// サンプルデータ（メインページと同じデータを使用）
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

interface RecipeDetailPageProps {
  params: {
    id: string;
  };
}

export default function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const recipeId = params.id;
  
  // サンプルIDかどうかを判定
  const isSampleId = recipeId.startsWith('sample-');
  
  // Convex IDの場合はクエリを使用（常に呼び出すがサンプルIDの場合は結果を無視）
  const recipe = useQuery(
    api.queries.getRecipeById, 
    isSampleId ? "skip" : { recipeId: recipeId as Id<'recipes'> }
  );
  
  // サンプルIDの場合はローカルデータから取得
  if (isSampleId) {
    const sampleRecipe = sampleRecipes.find(recipe => recipe._id === recipeId);
    
    if (!sampleRecipe) {
      notFound();
    }
    
    return (
      <div className="min-h-screen bg-wa-cream">
        <RecipeDetail recipe={sampleRecipe} />
      </div>
    );
  }

  if (recipe === undefined) {
    return (
      <div className="min-h-screen bg-wa-cream flex items-center justify-center">
        <div className="wa-paper p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-wa-orange border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-wa-charcoal">レシピを読み込んでいます...</p>
        </div>
      </div>
    );
  }

  if (recipe === null) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-wa-cream">
      <RecipeDetail recipe={recipe} />
    </div>
  );
}