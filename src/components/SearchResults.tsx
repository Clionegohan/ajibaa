"use client";

import { useState } from "react";
import Link from "next/link";
import { Recipe } from "@/types/recipe";
import Image from "next/image";

interface SearchResultsProps {
  results: Recipe[];
  filters: any;
  isLoading?: boolean;
}

export default function SearchResults({ results, filters, isLoading }: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-wa-charcoal/60">検索中...</div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-wa-charcoal mb-2">
          検索結果が見つかりませんでした
        </h3>
        <p className="text-wa-charcoal/70 mb-4">
          別のキーワードやフィルタで検索してみてください
        </p>
        <div className="text-sm text-wa-charcoal/60">
          <p>検索のコツ：</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>レシピ名の一部を入力してみる</li>
            <li>都道府県やカテゴリで絞り込む</li>
            <li>「おばあちゃんの味」などのキーワードを試す</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 検索結果ヘッダー */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-wa-charcoal">
            検索結果 ({results.length}件)
          </h2>
          {filters.query && (
            <p className="text-sm text-wa-charcoal/70 mt-1">
              「{filters.query}」の検索結果
            </p>
          )}
        </div>

        {/* 表示切り替え */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "grid"
                ? "bg-wa-orange text-white"
                : "bg-white border border-wa-brown/30 text-wa-charcoal hover:bg-wa-cream/50"
            }`}
            title="グリッド表示"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "list"
                ? "bg-wa-orange text-white"
                : "bg-white border border-wa-brown/30 text-wa-charcoal hover:bg-wa-cream/50"
            }`}
            title="リスト表示"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 16a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* 検索結果一覧 */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((recipe) => (
            <RecipeListItem key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}

// グリッド表示用のレシピカード
function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link href={`/recipes/${recipe._id}`}>
      <div className="wa-paper wa-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer">
        {/* 画像 */}
        <div className="aspect-video bg-gradient-to-br from-wa-cream to-wa-orange/20 flex items-center justify-center">
          {recipe.imageUrl ? (
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              width={400}
              height={225}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-4xl">🍽️</span>
          )}
        </div>

        {/* 内容 */}
        <div className="p-4">
          <h3 className="font-semibold text-wa-charcoal mb-2 line-clamp-2">
            {recipe.title}
          </h3>
          <p className="text-sm text-wa-charcoal/70 mb-3 line-clamp-2">
            {recipe.description}
          </p>

          {/* メタ情報 */}
          <div className="flex items-center justify-between text-xs text-wa-charcoal/60">
            <div className="flex items-center gap-3">
              <span>📍 {recipe.prefecture}</span>
              <span>⏱️ {recipe.cookingTime}分</span>
            </div>
            <div className="flex items-center gap-2">
              <span>❤️ {recipe.likeCount}</span>
              <span>👁️ {recipe.viewCount}</span>
            </div>
          </div>

          {/* タグ */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {recipe.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="bg-wa-charcoal/5 text-wa-charcoal px-2 py-1 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
              {recipe.tags.length > 3 && (
                <span className="text-xs text-wa-charcoal/50">
                  +{recipe.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// リスト表示用のレシピアイテム
function RecipeListItem({ recipe }: { recipe: Recipe }) {
  return (
    <Link href={`/recipes/${recipe._id}`}>
      <div className="wa-paper wa-border rounded-lg p-4 hover:shadow-lg transition-all duration-200 cursor-pointer">
        <div className="flex gap-4">
          {/* 画像 */}
          <div className="w-24 h-24 bg-gradient-to-br from-wa-cream to-wa-orange/20 rounded-lg flex items-center justify-center flex-shrink-0">
            {recipe.imageUrl ? (
              <Image
                src={recipe.imageUrl}
                alt={recipe.title}
                width={96}
                height={96}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <span className="text-2xl">🍽️</span>
            )}
          </div>

          {/* 内容 */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-wa-charcoal mb-1 line-clamp-1">
              {recipe.title}
            </h3>
            <p className="text-sm text-wa-charcoal/70 mb-2 line-clamp-2">
              {recipe.description}
            </p>

            {/* メタ情報 */}
            <div className="flex items-center gap-4 text-xs text-wa-charcoal/60 mb-2">
              <span>📍 {recipe.prefecture}</span>
              <span>🍳 {recipe.category}</span>
              <span>⏱️ {recipe.cookingTime}分</span>
              <span>❤️ {recipe.likeCount}</span>
              <span>👁️ {recipe.viewCount}</span>
            </div>

            {/* タグ */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {recipe.tags.slice(0, 5).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-wa-charcoal/5 text-wa-charcoal px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {recipe.tags.length > 5 && (
                  <span className="text-xs text-wa-charcoal/50">
                    +{recipe.tags.length - 5}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}