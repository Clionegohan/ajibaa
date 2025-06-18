"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface AdvancedSearchProps {
  onSearchResults: (results: any[]) => void;
  onFiltersChange: (filters: SearchFilters) => void;
}

interface SearchFilters {
  query: string;
  prefecture: string;
  category: string;
  season: string;
  tags: string[];
  cookingTimeMax: number | null;
  sortBy: "latest" | "popular" | "mostLiked" | "cookingTime";
}

export default function AdvancedSearch({ onSearchResults, onFiltersChange }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    prefecture: "",
    category: "",
    season: "",
    tags: [],
    cookingTimeMax: null,
    sortBy: "latest",
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 統計データ取得
  const prefectureStats = useQuery(api.search.getRecipeStatsByPrefecture) || [];
  const categoryStats = useQuery(api.search.getRecipeStatsByCategory) || [];
  const popularTags = useQuery(api.search.getPopularTags, { limit: 20 }) || [];

  // 検索実行
  const searchResults = useQuery(
    api.search.searchRecipes,
    {
      query: filters.query || undefined,
      prefecture: filters.prefecture || undefined,
      category: filters.category || undefined,
      season: filters.season || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      cookingTimeMax: filters.cookingTimeMax || undefined,
      sortBy: filters.sortBy,
      limit: 20,
    }
  );

  // 検索結果が更新されたら親コンポーネントに通知
  useEffect(() => {
    if (searchResults) {
      onSearchResults(searchResults);
    }
  }, [searchResults, onSearchResults]);

  // フィルタが変更されたら親コンポーネントに通知
  useEffect(() => {
    onFiltersChange({ ...filters, tags: selectedTags });
  }, [filters, selectedTags, onFiltersChange]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      prefecture: "",
      category: "",
      season: "",
      tags: [],
      cookingTimeMax: null,
      sortBy: "latest",
    });
    setSelectedTags([]);
  };

  const hasActiveFilters = filters.query || filters.prefecture || filters.category || 
                          filters.season || selectedTags.length > 0 || filters.cookingTimeMax;

  return (
    <div className="bg-white wa-border rounded-lg p-6 mb-6">
      {/* 基本検索バー */}
      <div className="flex gap-4 items-center mb-4">
        <div className="flex-1">
          <input
            type="text"
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            placeholder="🔍 レシピを検索（レシピ名、説明、おばあちゃんの思い出など）"
            className="w-full px-4 py-3 text-lg border border-wa-brown/30 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-wa-orange
                     placeholder:text-wa-charcoal/50"
          />
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-3 border border-wa-brown/30 rounded-lg hover:bg-wa-cream/50 
                   transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
          詳細検索
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-3 bg-wa-red/10 text-wa-red border border-wa-red/20 rounded-lg 
                     hover:bg-wa-red/20 transition-colors"
          >
            クリア
          </button>
        )}
      </div>

      {/* 詳細検索フィルタ */}
      {isExpanded && (
        <div className="space-y-6 pt-4 border-t border-wa-brown/20">
          {/* 都道府県・カテゴリ・季節 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-wa-charcoal mb-2">
                🗾 都道府県
              </label>
              <select
                value={filters.prefecture}
                onChange={(e) => handleFilterChange('prefecture', e.target.value)}
                className="w-full px-3 py-2 border border-wa-brown/30 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-wa-orange"
              >
                <option value="">すべて</option>
                {prefectureStats.map(({ prefecture, count }) => (
                  <option key={prefecture} value={prefecture}>
                    {prefecture} ({count}件)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-wa-charcoal mb-2">
                🍳 カテゴリ
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-wa-brown/30 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-wa-orange"
              >
                <option value="">すべて</option>
                {categoryStats.map(({ category, count }) => (
                  <option key={category} value={category}>
                    {category} ({count}件)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-wa-charcoal mb-2">
                🌸 季節
              </label>
              <select
                value={filters.season}
                onChange={(e) => handleFilterChange('season', e.target.value)}
                className="w-full px-3 py-2 border border-wa-brown/30 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-wa-orange"
              >
                <option value="">すべて</option>
                <option value="春">春</option>
                <option value="夏">夏</option>
                <option value="秋">秋</option>
                <option value="冬">冬</option>
              </select>
            </div>
          </div>

          {/* 調理時間・ソート */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-wa-charcoal mb-2">
                ⏱️ 調理時間（最大）
              </label>
              <select
                value={filters.cookingTimeMax || ""}
                onChange={(e) => handleFilterChange('cookingTimeMax', e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 border border-wa-brown/30 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-wa-orange"
              >
                <option value="">指定なし</option>
                <option value="15">15分以内</option>
                <option value="30">30分以内</option>
                <option value="60">1時間以内</option>
                <option value="120">2時間以内</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-wa-charcoal mb-2">
                📊 並び順
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value as any)}
                className="w-full px-3 py-2 border border-wa-brown/30 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-wa-orange"
              >
                <option value="latest">新着順</option>
                <option value="popular">人気順</option>
                <option value="mostLiked">いいね順</option>
                <option value="cookingTime">調理時間順</option>
              </select>
            </div>
          </div>

          {/* タグ選択 */}
          <div>
            <label className="block text-sm font-medium text-wa-charcoal mb-3">
              🏷️ タグで絞り込み
            </label>
            <div className="flex flex-wrap gap-2">
              {popularTags.map(({ tag, count }) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm border transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-wa-orange text-white border-wa-orange'
                      : 'bg-white text-wa-charcoal border-wa-brown/30 hover:border-wa-orange hover:bg-wa-orange/10'
                  }`}
                >
                  {tag} ({count})
                </button>
              ))}
            </div>
          </div>

          {/* 検索結果数 */}
          <div className="flex justify-between items-center pt-4 border-t border-wa-brown/20">
            <div className="text-sm text-wa-charcoal/70">
              {searchResults ? (
                `${searchResults.length}件のレシピが見つかりました`
              ) : (
                '検索中...'
              )}
            </div>
            
            {hasActiveFilters && (
              <div className="text-sm text-wa-orange">
                フィルタが適用されています
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}