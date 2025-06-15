import { Recipe } from '@/types/recipe';
import LikeButton from '@/components/LikeButton';

interface RecipeListProps {
  recipes: Recipe[];
}

export default function RecipeList({ recipes }: RecipeListProps) {
  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-wa-charcoal text-lg">
          レシピがまだありません
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <div
          key={recipe._id}
          className="wa-paper wa-border p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-wa-charcoal mb-2">
            {recipe.title}
          </h3>
          
          <p className="text-wa-charcoal/80 mb-3 line-clamp-2">
            {recipe.description}
          </p>
          
          <div className="flex justify-between items-center text-sm text-wa-charcoal/70 mb-3">
            <span className="bg-wa-orange/10 px-2 py-1 rounded">
              {recipe.prefecture}
            </span>
            <span className="bg-wa-green/10 px-2 py-1 rounded">
              {recipe.category}
            </span>
          </div>
          
          <div className="flex justify-between items-center text-sm text-wa-charcoal/70 mb-3">
            <span>⏱️ {recipe.cookingTime}分</span>
            <span>👥 {recipe.servings}人分</span>
          </div>
          
          {/* いいねボタン */}
          <div className="flex justify-between items-center">
            <LikeButton 
              recipeId={recipe._id}
              likeCount={recipe.likeCount}
              isLiked={false} // TODO: ユーザーのいいね状態を取得
            />
            <span className="text-xs text-wa-charcoal/50">
              👁️ {recipe.viewCount}
            </span>
          </div>
          
          {recipe.story && (
            <p className="text-xs text-wa-charcoal/60 mt-3 italic">
              {recipe.story}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}