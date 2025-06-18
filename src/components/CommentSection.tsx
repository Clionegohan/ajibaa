import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface Comment {
  _id: Id<"comments">;
  recipeId: Id<"recipes">;
  userId: Id<"users">;
  content: string;
  createdAt: number;
  updatedAt: number;
  isPublished: boolean;
  user: {
    _id: Id<"users">;
    name: string;
    email: string;
  };
  createdAtFormatted: string;
}

interface CommentSectionProps {
  recipeId: Id<"recipes">;
}

export default function CommentSection({ recipeId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<Id<"comments"> | null>(null);
  const [editContent, setEditContent] = useState("");
  
  // リアルタイムでコメントを取得
  const comments = useQuery(api.comments.getRecipeComments, { recipeId }) || [];
  const commentCount = useQuery(api.comments.getCommentCount, { recipeId });
  
  // Mutations
  const addComment = useMutation(api.comments.addComment);
  const deleteComment = useMutation(api.comments.deleteComment);
  const updateComment = useMutation(api.comments.updateComment);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const result = await addComment({
        recipeId,
        content: newComment.trim()
      });
      
      if (result.success) {
        setNewComment("");
        // 成功メッセージ（オプション）
      }
    } catch (error) {
      console.error("Comment submission failed:", error);
      alert("コメントの投稿に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (comment: Comment) => {
    setEditingId(comment._id);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleUpdateComment = async (commentId: Id<"comments">) => {
    if (!editContent.trim()) return;
    
    try {
      const result = await updateComment({
        commentId,
        content: editContent.trim()
      });
      
      if (result.success) {
        setEditingId(null);
        setEditContent("");
      }
    } catch (error) {
      console.error("Comment update failed:", error);
      alert("コメントの更新に失敗しました。");
    }
  };

  const handleDeleteComment = async (commentId: Id<"comments">) => {
    if (!confirm("このコメントを削除しますか？")) return;
    
    try {
      const result = await deleteComment({ commentId });
      
      if (result.success) {
        // 削除成功
      }
    } catch (error) {
      console.error("Comment deletion failed:", error);
      alert("コメントの削除に失敗しました。");
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
        💬 コメント {commentCount?.count || 0}件
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
          comments.map((comment: any) => (
            <div
              key={comment._id}
              className="p-4 wa-paper wa-border rounded-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-wa-charcoal">
                    {comment.user.name}
                  </span>
                  <span className="text-xs text-wa-charcoal/50">
                    {comment.createdAtFormatted}
                  </span>
                </div>
                
                {/* 編集・削除ボタン（作成者のみ表示） */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(comment)}
                    className="text-xs text-wa-charcoal/60 hover:text-wa-orange transition-colors"
                    title="編集"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-xs text-wa-charcoal/60 hover:text-wa-red transition-colors"
                    title="削除"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              {editingId === comment._id ? (
                /* 編集モード */
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 border border-wa-brown/30 rounded-md 
                             focus:outline-none focus:ring-2 focus:ring-wa-orange
                             resize-none h-20"
                    placeholder="コメントを編集..."
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 text-sm text-wa-charcoal/70 hover:text-wa-charcoal 
                               border border-wa-brown/30 rounded transition-colors"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={() => handleUpdateComment(comment._id)}
                      disabled={!editContent.trim()}
                      className="px-3 py-1 text-sm bg-wa-orange text-white rounded 
                               hover:bg-wa-orange/80 disabled:opacity-50 disabled:cursor-not-allowed
                               transition-colors"
                    >
                      更新
                    </button>
                  </div>
                </div>
              ) : (
                /* 表示モード */
                <p className="text-wa-charcoal/80 leading-relaxed">
                  {comment.content}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}