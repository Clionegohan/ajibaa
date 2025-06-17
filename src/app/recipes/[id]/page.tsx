'use client'

import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Recipe } from '@/types/recipe'
import LikeButton from '@/components/LikeButton'
// import CommentSection from '@/components/CommentSection'

interface RecipeDetailPageProps {
  params: { id: string }
}

export default function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const recipe = useQuery(api.queries.getRecipeById, { id: params.id }) as Recipe | null | undefined

  if (recipe === null) {
    return (
      <div className="min-h-screen bg-wa-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-wa-charcoal">レシピを読み込み中...</p>
        </div>
      </div>
    )
  }

  if (recipe === undefined) {
    return (
      <div className="min-h-screen bg-wa-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-wa-charcoal mb-4">レシピが見つかりません</p>
          <a href="/" className="text-wa-orange hover:underline">
            ホームに戻る
          </a>
        </div>
      </div>
    )
  }

  const difficultyText = ['', '★☆☆', '★★☆', '★★★'][recipe.difficulty] || '★☆☆'

  return (
    <div className="min-h-screen bg-wa-cream">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* ヘッダー */}
        <div className="mb-8">
          <a href="/" className="text-wa-orange hover:underline mb-4 inline-block">
            ← レシピ一覧に戻る
          </a>
          
          <h1 className="text-3xl md:text-4xl font-bold text-wa-charcoal mb-4">
            {recipe.title}
          </h1>
          
          <p className="text-lg text-wa-charcoal mb-4">
            {recipe.description}
          </p>

          {recipe.story && (
            <div className="bg-wa-orange/10 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-wa-charcoal mb-2">💭 思い出</h3>
              <p className="text-wa-charcoal">{recipe.story}</p>
            </div>
          )}
        </div>

        {/* メタデータ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg wa-border text-center">
            <div className="text-2xl mb-1">⏰</div>
            <div className="text-sm text-gray-600">調理時間</div>
            <div className="font-semibold text-wa-charcoal">{recipe.cookingTime}分</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg wa-border text-center">
            <div className="text-2xl mb-1">👥</div>
            <div className="text-sm text-gray-600">分量</div>
            <div className="font-semibold text-wa-charcoal">{recipe.servings}人分</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg wa-border text-center">
            <div className="text-2xl mb-1">📍</div>
            <div className="text-sm text-gray-600">地域</div>
            <div className="font-semibold text-wa-charcoal">{recipe.prefecture}</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg wa-border text-center">
            <div className="text-2xl mb-1">🍽️</div>
            <div className="text-sm text-gray-600">カテゴリ</div>
            <div className="font-semibold text-wa-charcoal">{recipe.category}</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 材料 */}
          <div className="bg-white p-6 rounded-lg wa-border">
            <h2 className="text-2xl font-semibold text-wa-charcoal mb-4 flex items-center">
              🛒 材料
            </h2>
            
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient._id} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-wa-charcoal">{ingredient.name}</span>
                    <span className="text-wa-charcoal font-medium">
                      {ingredient.amount}{ingredient.unit && ingredient.unit}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">材料情報がありません</p>
            )}
          </div>

          {/* 作り方 */}
          <div className="bg-white p-6 rounded-lg wa-border">
            <h2 className="text-2xl font-semibold text-wa-charcoal mb-4 flex items-center">
              👩‍🍳 作り方
            </h2>
            
            {recipe.steps && recipe.steps.length > 0 ? (
              <ol className="space-y-4">
                {recipe.steps.map((step) => (
                  <li key={step._id} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-wa-orange text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {step.stepNumber}
                    </span>
                    <div className="flex-1">
                      <p className="text-wa-charcoal">{step.instruction}</p>
                      {step.tips && (
                        <p className="text-sm text-gray-600 mt-1 italic">💡 {step.tips}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-gray-500">作り方情報がありません</p>
            )}
          </div>
        </div>

        {/* タグ */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-lg wa-border">
            <h3 className="text-xl font-semibold text-wa-charcoal mb-4">🏷️ タグ</h3>
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-wa-orange/10 text-wa-charcoal text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* いいね・コメント */}
        <div className="mt-8 bg-white p-6 rounded-lg wa-border">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <LikeButton 
                recipeId={recipe._id} 
                likeCount={recipe.likeCount} 
                isLiked={false}
              />
              <span className="text-gray-600">👁️ {recipe.viewCount}回表示</span>
            </div>
            
            {/* 編集ボタン（作成者のみ表示） */}
            <a
              href={`/recipes/${recipe._id}/edit`}
              className="px-4 py-2 bg-wa-orange/10 text-wa-orange border border-wa-orange rounded-lg hover:bg-wa-orange hover:text-white transition-colors"
            >
              ✏️ 編集
            </a>
          </div>
          
          {/* <CommentSection recipeId={recipe._id} /> */}
          <div className="mt-4 text-center text-gray-500">
            コメント機能は準備中です
          </div>
        </div>
      </div>
    </div>
  )
}