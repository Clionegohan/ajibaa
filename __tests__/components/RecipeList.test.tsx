import { render, screen } from '@testing-library/react'
import RecipeList from '@/components/RecipeList'
import { Recipe } from '@/types/recipe'
import { ConvexProvider } from 'convex/react'
import { ConvexReactClient } from 'convex/react'

// Next.js useRouter のモック
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}))

// ConvexProviderのテスト用セットアップ
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const client = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || 'https://test.convex.cloud')
  return (
    <ConvexProvider client={client}>
      {children}
    </ConvexProvider>
  )
}

const mockRecipes: Recipe[] = [
  {
    _id: "1",
    title: "青森のりんご煮",
    description: "おばあちゃんの優しいりんご煮",
    story: "寒い冬に母がよく作ってくれました",
    authorId: "user1",
    authorName: "田中花子",
    prefecture: "青森県",
    category: "おやつ・デザート",
    cookingTime: 30,
    season: ["秋", "冬"],
    tags: ["りんご", "郷土料理"],
    isPublished: true,
    viewCount: 150,
    likeCount: 23,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
  },
  {
    _id: "2",
    title: "大阪のお好み焼き",
    description: "関西風の本格お好み焼き",
    authorId: "user2",
    authorName: "大阪太郎",
    prefecture: "大阪府",
    category: "主食",
    cookingTime: 45,
    tags: ["粉もん", "関西"],
    isPublished: true,
    viewCount: 200,
    likeCount: 45,
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 172800000,
  }
];

describe('RecipeList Component', () => {
  it('should render recipe list with titles', () => {
    render(<RecipeList recipes={mockRecipes} />, { wrapper: TestWrapper });
    
    expect(screen.getByText('青森のりんご煮')).toBeInTheDocument();
    expect(screen.getByText('大阪のお好み焼き')).toBeInTheDocument();
  });

  it('should display recipe prefecture', () => {
    render(<RecipeList recipes={mockRecipes} />, { wrapper: TestWrapper });
    
    expect(screen.getByText('青森県')).toBeInTheDocument();
    expect(screen.getByText('大阪府')).toBeInTheDocument();
  });

  it('should show recipe category', () => {
    render(<RecipeList recipes={mockRecipes} />, { wrapper: TestWrapper });
    
    expect(screen.getByText('おやつ・デザート')).toBeInTheDocument();
    expect(screen.getByText('主食')).toBeInTheDocument();
  });

  it('should display cooking time', () => {
    render(<RecipeList recipes={mockRecipes} />, { wrapper: TestWrapper });
    
    expect(screen.getByText(/30分/)).toBeInTheDocument();
    expect(screen.getByText(/45分/)).toBeInTheDocument();
  });

  it('should render empty state when no recipes', () => {
    render(<RecipeList recipes={[]} />, { wrapper: TestWrapper });
    
    expect(screen.getByText(/レシピがまだありません/)).toBeInTheDocument();
  });
});