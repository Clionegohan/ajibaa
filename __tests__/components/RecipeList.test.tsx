import { render, screen } from '@testing-library/react'
import RecipeList from '@/components/RecipeList'
import { Recipe } from '@/types/recipe'

const mockRecipes: Recipe[] = [
  {
    _id: "1",
    title: "青森のりんご煮",
    description: "おばあちゃんの優しいりんご煮",
    story: "寒い冬に母がよく作ってくれました",
    authorId: "user1",
    prefecture: "青森県",
    category: "おやつ・デザート",
    difficulty: 2,
    cookingTime: 30,
    servings: 4,
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
    prefecture: "大阪府",
    category: "主食",
    difficulty: 3,
    cookingTime: 45,
    servings: 2,
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
    render(<RecipeList recipes={mockRecipes} />);
    
    expect(screen.getByText('青森のりんご煮')).toBeInTheDocument();
    expect(screen.getByText('大阪のお好み焼き')).toBeInTheDocument();
  });

  it('should display recipe prefecture', () => {
    render(<RecipeList recipes={mockRecipes} />);
    
    expect(screen.getByText('青森県')).toBeInTheDocument();
    expect(screen.getByText('大阪府')).toBeInTheDocument();
  });

  it('should show recipe category', () => {
    render(<RecipeList recipes={mockRecipes} />);
    
    expect(screen.getByText('おやつ・デザート')).toBeInTheDocument();
    expect(screen.getByText('主食')).toBeInTheDocument();
  });

  it('should display cooking time and servings', () => {
    render(<RecipeList recipes={mockRecipes} />);
    
    expect(screen.getByText(/30分/)).toBeInTheDocument();
    expect(screen.getByText(/4人分/)).toBeInTheDocument();
  });

  it('should render empty state when no recipes', () => {
    render(<RecipeList recipes={[]} />);
    
    expect(screen.getByText(/レシピがまだありません/)).toBeInTheDocument();
  });
});