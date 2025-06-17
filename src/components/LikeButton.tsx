import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface LikeButtonProps {
  recipeId: string;
  likeCount: number;
  isLiked: boolean;
}

export default function LikeButton({ recipeId, likeCount, isLiked }: LikeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const toggleLike = useMutation(api.mutations.toggleLike);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await toggleLike({ recipeId });
    } catch (error) {
      console.error("Like toggle failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
        isLiked 
          ? 'text-wa-red bg-wa-red/10 hover:bg-wa-red/20' 
          : 'text-wa-charcoal/60 bg-wa-charcoal/5 hover:bg-wa-charcoal/10'
      }`}
      aria-label={isLiked ? 'いいねを取り消す' : 'いいね'}
    >
      {/* ハートアイコン */}
      <svg 
        className="w-5 h-5" 
        fill={isLiked ? 'currentColor' : 'none'} 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </svg>
      
      {/* いいね数 */}
      <span className="text-sm font-medium">
        {likeCount}
      </span>
    </button>
  );
}