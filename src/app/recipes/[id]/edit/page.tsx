'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import { Recipe, RecipeIngredient, RecipeStep } from '@/types/recipe'
import { saveDraft, loadDraft, deleteDraft } from '@/lib/draft'

interface RecipeEditPageProps {
  params: { id: string }
}

export default function RecipeEditPage({ params }: RecipeEditPageProps) {
  const recipe = useQuery(api.queries.getRecipeById, { id: params.id }) as Recipe | null | undefined
  const updateRecipe = useMutation(api.mutations.updateRecipe)
  const deleteRecipe = useMutation(api.mutations.deleteRecipe)
  
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  // フォームの状態
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    story: '',
    prefecture: '',
    category: '',
    difficulty: 1,
    cookingTime: 30,
    servings: 2,
    tags: [] as string[],
    ingredients: [] as RecipeIngredient[],
    steps: [] as RecipeStep[],
    isPublished: true
  })

  // レシピデータまたは下書きデータが読み込まれたらフォームに設定
  useEffect(() => {
    if (recipe) {
      // 下書きデータがあるかチェック
      const draftData = loadDraft(params.id)
      
      if (draftData) {
        // 下書きデータがある場合は確認ダイアログを表示
        const useDraft = window.confirm(
          `この記事の下書きが見つかりました。\n下書きを復元しますか？\n\n保存日時: ${new Date(draftData.savedAt).toLocaleString()}`
        )
        
        if (useDraft) {
          setFormData(draftData.data)
          return
        } else {
          // 下書きを使わない場合は削除
          deleteDraft(params.id)
        }
      }
      
      // 通常のレシピデータをセット
      setFormData({
        title: recipe.title || '',
        description: recipe.description || '',
        story: recipe.story || '',
        prefecture: recipe.prefecture || '',
        category: recipe.category || '',
        difficulty: recipe.difficulty || 1,
        cookingTime: recipe.cookingTime || 30,
        servings: recipe.servings || 2,
        tags: recipe.tags || [],
        ingredients: recipe.ingredients || [],
        steps: recipe.steps || [],
        isPublished: recipe.isPublished ?? true
      })
    }
  }, [recipe, params.id])

  // 自動下書き保存（30秒間隔）
  useEffect(() => {
    const interval = setInterval(() => {
      if (formData.title || formData.description) {
        saveDraft(params.id, formData)
      }
    }, 30000) // 30秒

    return () => clearInterval(interval)
  }, [formData, params.id])

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

  const handleSave = async (isDraft = false) => {
    setIsLoading(true)
    try {
      await updateRecipe({
        id: params.id,
        ...formData,
        isPublished: !isDraft
      })
      
      // 保存成功時は下書きを削除
      deleteDraft(params.id)
      
      // 保存成功時の処理
      window.location.href = `/recipes/${params.id}`
    } catch (error) {
      console.error('保存に失敗しました:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDraftSave = () => {
    saveDraft(params.id, formData)
    alert('下書きを保存しました')
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await deleteRecipe({ id: params.id })
      // 削除成功時の処理
      window.location.href = '/'
    } catch (error) {
      console.error('削除に失敗しました:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-wa-cream">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* ヘッダー */}
        <div className="mb-8">
          <a href={`/recipes/${params.id}`} className="text-wa-orange hover:underline mb-4 inline-block">
            ← レシピに戻る
          </a>
          
          <h1 className="text-3xl font-bold text-wa-charcoal mb-4">
            レシピを編集
          </h1>
        </div>

        {/* 基本情報 */}
        <div className="bg-white rounded-lg p-6 wa-border mb-6">
          <h2 className="text-xl font-semibold text-wa-charcoal mb-4">基本情報</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-wa-charcoal mb-1">
                タイトル
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-orange"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-wa-charcoal mb-1">
                説明
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-orange"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-wa-charcoal mb-1">
                思い出・エピソード
              </label>
              <textarea
                value={formData.story}
                onChange={(e) => setFormData({...formData, story: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-orange"
              />
            </div>
          </div>
        </div>

        {/* 材料 */}
        <div className="bg-white rounded-lg p-6 wa-border mb-6">
          <h2 className="text-xl font-semibold text-wa-charcoal mb-4">材料</h2>
          
          {formData.ingredients.map((ingredient, index) => (
            <div key={ingredient._id} className="flex gap-2 mb-2">
              <input
                type="text"
                value={ingredient.name}
                placeholder="材料名"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-orange"
                readOnly
              />
              <input
                type="text"
                value={ingredient.amount}
                placeholder="分量"
                className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-orange"
                readOnly
              />
            </div>
          ))}
        </div>

        {/* 作り方 */}
        <div className="bg-white rounded-lg p-6 wa-border mb-6">
          <h2 className="text-xl font-semibold text-wa-charcoal mb-4">作り方</h2>
          
          {formData.steps.map((step, index) => (
            <div key={step._id} className="flex gap-2 mb-2">
              <span className="flex-shrink-0 w-8 h-8 bg-wa-orange text-white rounded-full flex items-center justify-center font-semibold text-sm">
                {step.stepNumber}
              </span>
              <textarea
                value={step.instruction}
                placeholder="手順を入力"
                rows={2}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-orange"
                readOnly
              />
            </div>
          ))}
        </div>

        {/* アクションボタン */}
        <div className="flex gap-4 justify-between">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isLoading}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            削除
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={handleDraftSave}
              disabled={isLoading}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              下書き保存
            </button>
            
            <button
              onClick={() => handleSave(false)}
              disabled={isLoading}
              className="px-6 py-2 bg-wa-orange text-white rounded-lg hover:bg-wa-orange/80 transition-colors disabled:opacity-50"
            >
              保存
            </button>
          </div>
        </div>

        {/* 削除確認ダイアログ */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
              <h3 className="text-lg font-semibold text-wa-charcoal mb-4">
                本当に削除しますか？
              </h3>
              <p className="text-wa-charcoal/70 mb-6">
                この操作は取り消せません。
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-wa-charcoal border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                >
                  削除
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}