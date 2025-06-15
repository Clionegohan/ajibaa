import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConvexProvider, ConvexReactClient } from "convex/react";
import CommentSection from '@/components/CommentSection'

// モッククライアント
const mockConvex = new ConvexReactClient("https://mock.convex.cloud");

const MockConvexProvider = ({ children }: { children: React.ReactNode }) => (
  <ConvexProvider client={mockConvex}>{children}</ConvexProvider>
);

// useMutationのモック
const mockAddComment = jest.fn();
jest.mock('convex/react', () => ({
  ...jest.requireActual('convex/react'),
  useMutation: () => mockAddComment,
}));

const mockComments = [
  {
    _id: "comment-1",
    recipeId: "recipe-1",
    authorId: "user-1",
    authorName: "田中さん",
    content: "とても美味しそうです！作ってみます。",
    createdAt: Date.now() - 3600000, // 1時間前
  },
  {
    _id: "comment-2",
    recipeId: "recipe-1",
    authorId: "user-2",
    authorName: "佐藤さん",
    content: "おばあちゃんの味を思い出しました。ありがとうございます。",
    createdAt: Date.now() - 7200000, // 2時間前
  }
];

describe('CommentSection Component', () => {
  beforeEach(() => {
    mockAddComment.mockClear();
  });

  it('should render comment form and existing comments', () => {
    render(
      <MockConvexProvider>
        <CommentSection 
          recipeId="recipe-1" 
          comments={mockComments}
        />
      </MockConvexProvider>
    );
    
    // コメントフォーム
    expect(screen.getByPlaceholderText(/コメントを入力/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /投稿/i })).toBeInTheDocument();
    
    // 既存のコメント
    expect(screen.getByText('田中さん')).toBeInTheDocument();
    expect(screen.getByText('とても美味しそうです！作ってみます。')).toBeInTheDocument();
    expect(screen.getByText('佐藤さん')).toBeInTheDocument();
    expect(screen.getByText('おばあちゃんの味を思い出しました。ありがとうございます。')).toBeInTheDocument();
  });

  it('should show comment count', () => {
    render(
      <MockConvexProvider>
        <CommentSection 
          recipeId="recipe-1" 
          comments={mockComments}
        />
      </MockConvexProvider>
    );
    
    expect(screen.getByText(/コメント 2件/i)).toBeInTheDocument();
  });

  it('should submit comment when form is filled and submitted', async () => {
    const user = userEvent.setup();
    
    render(
      <MockConvexProvider>
        <CommentSection 
          recipeId="recipe-1" 
          comments={mockComments}
        />
      </MockConvexProvider>
    );
    
    const textarea = screen.getByPlaceholderText(/コメントを入力/i);
    const submitButton = screen.getByRole('button', { name: /投稿/i });
    
    // コメントを入力
    await user.type(textarea, 'このレシピ、試してみました！');
    await user.click(submitButton);
    
    expect(mockAddComment).toHaveBeenCalledWith({
      recipeId: "recipe-1",
      content: "このレシピ、試してみました！"
    });
  });

  it('should not submit empty comment', async () => {
    const user = userEvent.setup();
    
    render(
      <MockConvexProvider>
        <CommentSection 
          recipeId="recipe-1" 
          comments={mockComments}
        />
      </MockConvexProvider>
    );
    
    const submitButton = screen.getByRole('button', { name: /投稿/i });
    
    // 空のコメントで投稿を試行
    await user.click(submitButton);
    
    expect(mockAddComment).not.toHaveBeenCalled();
  });

  it('should clear textarea after successful submission', async () => {
    const user = userEvent.setup();
    mockAddComment.mockResolvedValue({ success: true });
    
    render(
      <MockConvexProvider>
        <CommentSection 
          recipeId="recipe-1" 
          comments={mockComments}
        />
      </MockConvexProvider>
    );
    
    const textarea = screen.getByPlaceholderText(/コメントを入力/i);
    const submitButton = screen.getByRole('button', { name: /投稿/i });
    
    await user.type(textarea, 'テストコメント');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(textarea).toHaveValue('');
    });
  });

  it('should show loading state during submission', async () => {
    const user = userEvent.setup();
    mockAddComment.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(
      <MockConvexProvider>
        <CommentSection 
          recipeId="recipe-1" 
          comments={mockComments}
        />
      </MockConvexProvider>
    );
    
    const textarea = screen.getByPlaceholderText(/コメントを入力/i);
    const submitButton = screen.getByRole('button', { name: /投稿/i });
    
    await user.type(textarea, 'テストコメント');
    await user.click(submitButton);
    
    // ローディング中はボタンが無効化される
    expect(submitButton).toBeDisabled();
  });

  it('should show empty state when no comments', () => {
    render(
      <MockConvexProvider>
        <CommentSection 
          recipeId="recipe-1" 
          comments={[]}
        />
      </MockConvexProvider>
    );
    
    expect(screen.getByText(/まだコメントがありません/i)).toBeInTheDocument();
  });

  it('should display relative timestamps', () => {
    render(
      <MockConvexProvider>
        <CommentSection 
          recipeId="recipe-1" 
          comments={mockComments}
        />
      </MockConvexProvider>
    );
    
    // 相対時間が表示される
    expect(screen.getByText(/1時間前/i)).toBeInTheDocument();
    expect(screen.getByText(/2時間前/i)).toBeInTheDocument();
  });
});