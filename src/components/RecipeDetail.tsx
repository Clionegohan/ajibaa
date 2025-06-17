import { Recipe } from '@/types/recipe';
import LikeButton from '@/components/LikeButton';

interface RecipeDetailProps {
  recipe: Recipe;
}

export default function RecipeDetail({ recipe }: RecipeDetailProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* ヘッダー部分 */}
      <div className="wa-paper wa-border p-6 mb-6">
        <h1 className="text-3xl font-bold text-wa-charcoal mb-4">
          {recipe.title}
        </h1>
        
        <p className="text-wa-charcoal/80 text-lg mb-4">
          {recipe.description}
        </p>

        {/* メタデータ */}
        <div className="flex flex-wrap gap-4 mb-4">
          <span className="bg-wa-orange/10 px-3 py-1 rounded-full text-sm">
            📍 {recipe.prefecture}
          </span>
          <span className="bg-wa-green/10 px-3 py-1 rounded-full text-sm">
            🍳 {recipe.category}
          </span>
          <span className="bg-wa-blue/10 px-3 py-1 rounded-full text-sm">
            ⏱️ {recipe.cookingTime}分
          </span>
        </div>

        {/* 作者情報 */}
        {recipe.authorName && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-wa-charcoal/70">
              👤 {recipe.authorName}
            </span>
          </div>
        )}

        {/* いいね・閲覧数 */}
        <div className="flex items-center justify-between">
          <LikeButton 
            recipeId={recipe._id}
            likeCount={recipe.likeCount}
            isLiked={false} // TODO: ユーザーのいいね状態を取得
          />
          <span className="text-sm text-wa-charcoal/50">
            👁️ {recipe.viewCount}
          </span>
        </div>
      </div>

      {/* ストーリー */}
      {recipe.story && (
        <div className="wa-paper wa-border p-6 mb-6">
          <h2 className="text-xl font-semibold text-wa-charcoal mb-3">
            🌸 おばあちゃんの思い出
          </h2>
          <p className="text-wa-charcoal/80 leading-relaxed italic">
            {recipe.story}
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 材料 */}
        <div className="wa-paper wa-border p-6">
          <h2 className="text-xl font-semibold text-wa-charcoal mb-4">
            🥄 材料
          </h2>
          
          {recipe.ingredients && recipe.ingredients.length > 0 ? (
            <div className="space-y-3">
              {recipe.ingredients.map((ingredient) => (
                <div key={ingredient._id} className="flex justify-between items-center border-b border-wa-charcoal/10 pb-2">
                  <span className="text-wa-charcoal font-medium">
                    {ingredient.name}
                  </span>
                  <span className="text-wa-charcoal/70">
                    {ingredient.amount}{ingredient.unit && ` ${ingredient.unit}`}
                  </span>
                </div>
              ))}
              
              {/* 材料のメモ */}
              {recipe.ingredients.some(ing => ing.note) && (
                <div className="mt-4 pt-4 border-t border-wa-charcoal/10">
                  <h3 className="text-sm font-medium text-wa-charcoal mb-2">
                    💡 材料について
                  </h3>
                  {recipe.ingredients.filter(ing => ing.note).map((ingredient) => (
                    <p key={`note-${ingredient._id}`} className="text-xs text-wa-charcoal/60 mb-1">
                      <strong>{ingredient.name}:</strong> {ingredient.note}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-wa-charcoal/60 text-sm">
              材料情報はまだ登録されていません。
            </p>
          )}
        </div>

        {/* 作り方 */}
        <div className="wa-paper wa-border p-6">
          <h2 className="text-xl font-semibold text-wa-charcoal mb-4">
            👩‍🍳 作り方
          </h2>
          
          {recipe.steps && recipe.steps.length > 0 ? (
            <div className="space-y-4">
              {recipe.steps.map((step) => (
                <div key={step._id} className="border-l-4 border-wa-orange pl-4">
                  <div className="flex items-start gap-3">
                    <span className="bg-wa-orange text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                      {step.stepNumber}
                    </span>
                    <div className="flex-1">
                      <p className="text-wa-charcoal leading-relaxed mb-2">
                        {step.instruction}
                      </p>
                      {step.tips && (
                        <p className="text-xs text-wa-charcoal/60 bg-wa-orange/5 p-2 rounded">
                          💡 {step.tips}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-wa-charcoal/60 text-sm">
              作り方はまだ登録されていません。
            </p>
          )}
        </div>
      </div>

      {/* タグ */}
      {recipe.tags && recipe.tags.length > 0 && (
        <div className="wa-paper wa-border p-6 mt-6">
          <h2 className="text-xl font-semibold text-wa-charcoal mb-3">
            🏷️ タグ
          </h2>
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag, index) => (
              <span 
                key={index}
                className="bg-wa-charcoal/5 text-wa-charcoal px-3 py-1 rounded-full text-sm border border-wa-charcoal/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 季節情報 */}
      {recipe.season && recipe.season.length > 0 && (
        <div className="wa-paper wa-border p-6 mt-6">
          <h2 className="text-xl font-semibold text-wa-charcoal mb-3">
            🌸 おすすめの季節
          </h2>
          <div className="flex gap-2">
            {recipe.season.map((season, index) => (
              <span 
                key={index}
                className="bg-wa-green/10 text-wa-green px-3 py-1 rounded-full text-sm"
              >
                {season}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}