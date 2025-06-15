import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConvexProvider, ConvexReactClient } from "convex/react";
import LikeButton from '@/components/LikeButton'

// モッククライアント
const mockConvex = new ConvexReactClient("https://mock.convex.cloud");

const MockConvexProvider = ({ children }: { children: React.ReactNode }) => (
  <ConvexProvider client={mockConvex}>{children}</ConvexProvider>
);

// useMutationのモック
const mockToggleLike = jest.fn();
jest.mock('convex/react', () => ({
  ...jest.requireActual('convex/react'),
  useMutation: () => mockToggleLike,
}));

describe('LikeButton Component', () => {
  beforeEach(() => {
    mockToggleLike.mockClear();
  });

  it('should render like button with count', () => {
    render(
      <MockConvexProvider>
        <LikeButton 
          recipeId="recipe-1" 
          likeCount={5} 
          isLiked={false}
        />
      </MockConvexProvider>
    );
    
    expect(screen.getByRole('button', { name: /いいね/i })).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should show filled heart when liked', () => {
    render(
      <MockConvexProvider>
        <LikeButton 
          recipeId="recipe-1" 
          likeCount={5} 
          isLiked={true}
        />
      </MockConvexProvider>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-wa-red'); // いいね済みの色
  });

  it('should show empty heart when not liked', () => {
    render(
      <MockConvexProvider>
        <LikeButton 
          recipeId="recipe-1" 
          likeCount={5} 
          isLiked={false}
        />
      </MockConvexProvider>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-wa-charcoal/60'); // 未いいねの色
  });

  it('should call toggle like mutation when clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <MockConvexProvider>
        <LikeButton 
          recipeId="recipe-1" 
          likeCount={5} 
          isLiked={false}
        />
      </MockConvexProvider>
    );
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(mockToggleLike).toHaveBeenCalledWith({
      recipeId: "recipe-1"
    });
  });

  it('should show loading state when processing', async () => {
    const user = userEvent.setup();
    // ローディング状態をシミュレート
    mockToggleLike.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(
      <MockConvexProvider>
        <LikeButton 
          recipeId="recipe-1" 
          likeCount={5} 
          isLiked={false}
        />
      </MockConvexProvider>
    );
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    // ローディング中はボタンが無効化される
    expect(button).toBeDisabled();
  });

  it('should display correct count format', () => {
    // 大きな数字のテスト
    render(
      <MockConvexProvider>
        <LikeButton 
          recipeId="recipe-1" 
          likeCount={1234} 
          isLiked={false}
        />
      </MockConvexProvider>
    );
    
    expect(screen.getByText('1234')).toBeInTheDocument();
  });

  it('should handle zero likes', () => {
    render(
      <MockConvexProvider>
        <LikeButton 
          recipeId="recipe-1" 
          likeCount={0} 
          isLiked={false}
        />
      </MockConvexProvider>
    );
    
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});