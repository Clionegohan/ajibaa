import { Recipe } from '@/types/recipe';
import LikeButton from '@/components/LikeButton';
import { useRouter } from 'next/navigation';

interface RecipeListProps {
  recipes: Recipe[];
}

export default function RecipeList({ recipes }: RecipeListProps) {
  const router = useRouter();

  const handleRecipeClick = (recipeId: string) => {
    router.push(`/recipes/${recipeId}`);
  };

  const handleAuthorClick = (e: React.MouseEvent, authorId: string) => {
    e.stopPropagation();
    router.push(`/profile/${authorId}`);
  };

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
          onClick={() => handleRecipeClick(recipe._id)}
          className="block wa-paper wa-border p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
        >
          <h3 className="text-xl font-semibold text-wa-charcoal mb-2 hover:text-wa-orange transition-colors">
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
          </div>
          
          {/* 投稿者情報 */}
          {recipe.authorName && (
            <div className="mb-3">
              <button 
                onClick={(e) => handleAuthorClick(e, recipe.authorId)}
                className="text-sm text-wa-charcoal/70 hover:text-wa-orange transition-colors text-left"
              >
                👤 {recipe.authorName}
              </button>
            </div>
          )}
          
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