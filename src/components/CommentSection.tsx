import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface Comment {
  _id: string;
  recipeId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: number;
}

interface CommentSectionProps {
  recipeId: string;
  comments: Comment[];
}

export default function CommentSection({ recipeId, comments }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addComment = useMutation(api.mutations.addComment);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await addComment({
        recipeId,
        content: newComment.trim()
      });
      setNewComment("");
    } catch (error) {
      console.error("Comment submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}日前`;
    if (hours > 0) return `${hours}時間前`;
    if (minutes > 0) return `${minutes}分前`;
    return '今';
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-wa-charcoal mb-4">
        💬 コメント {comments.length}件
      </h3>
      
      {/* コメント投稿フォーム */}
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="コメントを入力してください..."
          className="w-full px-3 py-2 border border-wa-brown/30 rounded-md 
                   focus:outline-none focus:ring-2 focus:ring-wa-orange
                   resize-none h-20"
          disabled={isSubmitting}
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className="px-4 py-2 bg-wa-orange text-white rounded-md 
                     hover:bg-wa-orange/80 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
          >
            {isSubmitting ? '投稿中...' : '投稿'}
          </button>
        </div>
      </form>
      
      {/* コメント一覧 */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-wa-charcoal/60 text-center py-8">
            まだコメントがありません。最初のコメントを投稿してみませんか？
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="p-4 wa-paper wa-border rounded-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-wa-charcoal">
                  {comment.authorName}
                </span>
                <span className="text-xs text-wa-charcoal/50">
                  {formatRelativeTime(comment.createdAt)}
                </span>
              </div>
              <p className="text-wa-charcoal/80">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}