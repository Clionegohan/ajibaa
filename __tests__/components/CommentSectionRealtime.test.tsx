import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ConvexProvider, ConvexReactClient } from "convex/react";
import CommentSection from '@/components/CommentSection'

const mockConvex = new ConvexReactClient("https://mock.convex.cloud");

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ConvexProvider client={mockConvex}>
    {children}
  </ConvexProvider>
);

// Mock mutations and queries
const mockAddComment = jest.fn();
const mockDeleteComment = jest.fn();
const mockUpdateComment = jest.fn();

const mockComments = [
  {
    _id: "comment-1",
    recipeId: "test-recipe-1",
    userId: "user-1",
    content: "とても美味しそうですね！今度作ってみます。",
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 3600000,
    isPublished: true,
    user: {
      _id: "user-1",
      name: "田中花子",
      email: "tanaka@example.com"
    },
    createdAtFormatted: "2024年6月18日 14:00"
  },
  {
    _id: "comment-2",
    recipeId: "test-recipe-1", 
    userId: "user-2",
    content: "家族にも好評でした。ありがとうございます。",
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now() - 7200000,
    isPublished: true,
    user: {
      _id: "user-2",
      name: "佐藤太郎",
      email: "sato@example.com"
    },
    createdAtFormatted: "2024年6月18日 13:00"
  }
];

jest.mock('convex/react', () => ({
  ...jest.requireActual('convex/react'),
  useQuery: jest.fn((query) => {
    const queryString = query?.toString() || '';
    if (queryString.includes('getRecipeComments')) {
      return mockComments;
    }
    if (queryString.includes('getCommentCount')) {
      return { count: mockComments.length };
    }
    return null;
  }),
  useMutation: jest.fn((mutation) => {
    const mutationString = mutation?.toString() || '';
    if (mutationString.includes('addComment')) {
      return mockAddComment;
    }
    if (mutationString.includes('deleteComment')) {
      return mockDeleteComment;
    }
    if (mutationString.includes('updateComment')) {
      return mockUpdateComment;
    }
    return jest.fn();
  }),
}));

// Convex API mock
jest.mock('../../convex/_generated/api', () => ({
  api: {
    comments: {
      getRecipeComments: 'getRecipeComments',
      getCommentCount: 'getCommentCount',
      addComment: 'addComment',
      deleteComment: 'deleteComment',
      updateComment: 'updateComment'
    }
  }
}));

describe('CommentSection Component - Real-time', () => {
  const mockRecipeId = "test-recipe-1" as any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAddComment.mockResolvedValue({ success: true });
    mockDeleteComment.mockResolvedValue({ success: true });
    mockUpdateComment.mockResolvedValue({ success: true });
  });

  it('should render comment count from query', () => {
    render(
      <TestWrapper>
        <CommentSection recipeId={mockRecipeId} />
      </TestWrapper>
    );
    
    expect(screen.getByText('💬 コメント 2件')).toBeInTheDocument();
  });

  it('should render existing comments from query', () => {
    render(
      <TestWrapper>
        <CommentSection recipeId={mockRecipeId} />
      </TestWrapper>
    );
    
    expect(screen.getByText('田中花子')).toBeInTheDocument();
    expect(screen.getByText('佐藤太郎')).toBeInTheDocument();
    expect(screen.getByText('とても美味しそうですね！今度作ってみます。')).toBeInTheDocument();
    expect(screen.getByText('家族にも好評でした。ありがとうございます。')).toBeInTheDocument();
  });

  it('should render comment form', () => {
    render(
      <TestWrapper>
        <CommentSection recipeId={mockRecipeId} />
      </TestWrapper>
    );
    
    expect(screen.getByPlaceholderText('コメントを入力してください...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '投稿' })).toBeInTheDocument();
  });

  it('should handle comment submission', async () => {
    render(
      <TestWrapper>
        <CommentSection recipeId={mockRecipeId} />
      </TestWrapper>
    );
    
    const textarea = screen.getByPlaceholderText('コメントを入力してください...');
    const submitButton = screen.getByRole('button', { name: '投稿' });
    
    fireEvent.change(textarea, { target: { value: 'テストコメント' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockAddComment).toHaveBeenCalledWith({
        recipeId: mockRecipeId,
        content: 'テストコメント'
      });
    });
  });

  it('should show edit and delete buttons for comments', () => {
    render(
      <TestWrapper>
        <CommentSection recipeId={mockRecipeId} />
      </TestWrapper>
    );
    
    // 編集・削除ボタンが表示されることを確認
    const editButtons = screen.getAllByTitle('編集');
    const deleteButtons = screen.getAllByTitle('削除');
    
    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });

  it('should handle comment editing', async () => {
    render(
      <TestWrapper>
        <CommentSection recipeId={mockRecipeId} />
      </TestWrapper>
    );
    
    const editButtons = screen.getAllByTitle('編集');
    fireEvent.click(editButtons[0]);
    
    // 編集モードに入ることを確認
    expect(screen.getByPlaceholderText('コメントを編集...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '更新' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument();
  });

  it('should handle comment deletion with confirmation', async () => {
    // confirm のモック
    window.confirm = jest.fn(() => true);
    
    render(
      <TestWrapper>
        <CommentSection recipeId={mockRecipeId} />
      </TestWrapper>
    );
    
    const deleteButtons = screen.getAllByTitle('削除');
    fireEvent.click(deleteButtons[0]);
    
    expect(window.confirm).toHaveBeenCalledWith('このコメントを削除しますか？');
    
    await waitFor(() => {
      expect(mockDeleteComment).toHaveBeenCalledWith({
        commentId: 'comment-1'
      });
    });
  });

  it('should show empty state when no comments', () => {
    // コメントが空の場合のモック
    const { useQuery } = require('convex/react');
    useQuery.mockImplementation((query) => {
      const queryString = query?.toString() || '';
      if (queryString.includes('getRecipeComments')) {
        return [];
      }
      if (queryString.includes('getCommentCount')) {
        return { count: 0 };
      }
      return null;
    });

    render(
      <TestWrapper>
        <CommentSection recipeId={mockRecipeId} />
      </TestWrapper>
    );
    
    expect(screen.getByText('💬 コメント 0件')).toBeInTheDocument();
    expect(screen.getByText('まだコメントがありません。最初のコメントを投稿してみませんか？')).toBeInTheDocument();
  });

  it('should disable submit button when comment is empty', () => {
    render(
      <TestWrapper>
        <CommentSection recipeId={mockRecipeId} />
      </TestWrapper>
    );
    
    const submitButton = screen.getByRole('button', { name: '投稿' });
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when comment has content', () => {
    render(
      <TestWrapper>
        <CommentSection recipeId={mockRecipeId} />
      </TestWrapper>
    );
    
    const textarea = screen.getByPlaceholderText('コメントを入力してください...');
    const submitButton = screen.getByRole('button', { name: '投稿' });
    
    fireEvent.change(textarea, { target: { value: 'テストコメント' } });
    
    expect(submitButton).not.toBeDisabled();
  });
});