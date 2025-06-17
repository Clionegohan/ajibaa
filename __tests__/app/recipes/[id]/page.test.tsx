import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ConvexReactClient } from 'convex/react'
import { ConvexProvider } from 'convex/react'
import RecipeDetailPage from '@/app/recipes/[id]/page'
import { Recipe } from '@/types/recipe'

// Mock useQuery
jest.mock('convex/react', () => ({
  ...jest.requireActual('convex/react'),
  useQuery: jest.fn(),
}))

const mockRecipe: Recipe = {
  _id: "test-recipe-1",
  title: "青森のりんご煮",
  description: "おばあちゃんの優しいりんご煮。甘すぎず、りんごの自然な味を楽しめます。",
  story: "寒い冬の日に、ストーブの上でコトコト煮てくれたおばあちゃん。",
  authorId: "user1",
  prefecture: "青森県",
  category: "おやつ・デザート",
  difficulty: 2,
  cookingTime: 30,
  servings: 4,
  season: ["秋", "冬"],
  tags: ["りんご", "郷土料理", "おばあちゃんの味"],
  ingredients: [
    {
      _id: "ing-1",
      recipeId: "test-recipe-1",
      name: "りんご",
      amount: "3",
      unit: "個",
      order: 1
    },
    {
      _id: "ing-2",
      recipeId: "test-recipe-1",
      name: "砂糖",
      amount: "大さじ2",
      order: 2
    }
  ],
  steps: [
    {
      _id: "step-1",
      recipeId: "test-recipe-1",
      stepNumber: 1,
      instruction: "りんごを皮をむいて8等分に切る"
    },
    {
      _id: "step-2",
      recipeId: "test-recipe-1",
      stepNumber: 2,
      instruction: "鍋にりんごと砂糖を入れて弱火で20分煮る"
    }
  ],
  isPublished: true,
  viewCount: 150,
  likeCount: 23,
  createdAt: Date.now() - 86400000,
  updatedAt: Date.now() - 86400000,
}

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ConvexProvider client={new ConvexReactClient("https://test.convex.cloud")}>
    {children}
  </ConvexProvider>
)

describe('RecipeDetailPage', () => {
  const mockUseQuery = require('convex/react').useQuery

  beforeEach(() => {
    mockUseQuery.mockReturnValue(mockRecipe)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render recipe title and description', () => {
    render(<RecipeDetailPage params={{ id: 'test-recipe-1' }} />, { wrapper: TestWrapper })
    
    expect(screen.getByText('青森のりんご煮')).toBeInTheDocument()
    expect(screen.getByText('おばあちゃんの優しいりんご煮。甘すぎず、りんごの自然な味を楽しめます。')).toBeInTheDocument()
  })

  it('should render recipe story', () => {
    render(<RecipeDetailPage params={{ id: 'test-recipe-1' }} />, { wrapper: TestWrapper })
    
    expect(screen.getByText('寒い冬の日に、ストーブの上でコトコト煮てくれたおばあちゃん。')).toBeInTheDocument()
  })

  it('should render recipe metadata', () => {
    render(<RecipeDetailPage params={{ id: 'test-recipe-1' }} />, { wrapper: TestWrapper })
    
    expect(screen.getByText('30分')).toBeInTheDocument()
    expect(screen.getByText('4人分')).toBeInTheDocument()
    expect(screen.getByText('青森県')).toBeInTheDocument()
    expect(screen.getByText('おやつ・デザート')).toBeInTheDocument()
  })

  it('should render ingredients list', () => {
    render(<RecipeDetailPage params={{ id: 'test-recipe-1' }} />, { wrapper: TestWrapper })
    
    expect(screen.getAllByText('りんご')).toHaveLength(2) // 材料とタグに両方ある
    expect(screen.getByText('3個')).toBeInTheDocument()
    expect(screen.getByText('砂糖')).toBeInTheDocument()
    expect(screen.getByText('大さじ2')).toBeInTheDocument()
  })

  it('should render cooking steps', () => {
    render(<RecipeDetailPage params={{ id: 'test-recipe-1' }} />, { wrapper: TestWrapper })
    
    expect(screen.getByText('りんごを皮をむいて8等分に切る')).toBeInTheDocument()
    expect(screen.getByText('鍋にりんごと砂糖を入れて弱火で20分煮る')).toBeInTheDocument()
  })

  it('should render tags', () => {
    render(<RecipeDetailPage params={{ id: 'test-recipe-1' }} />, { wrapper: TestWrapper })
    
    expect(screen.getAllByText('りんご')).toHaveLength(2) // 材料とタグに両方ある
    expect(screen.getByText('郷土料理')).toBeInTheDocument()
    expect(screen.getByText('おばあちゃんの味')).toBeInTheDocument()
  })

  it('should render loading state when recipe is not loaded', () => {
    mockUseQuery.mockReturnValue(null)
    
    render(<RecipeDetailPage params={{ id: 'test-recipe-1' }} />, { wrapper: TestWrapper })
    
    expect(screen.getByText('レシピを読み込み中...')).toBeInTheDocument()
  })

  it('should render not found state when recipe does not exist', () => {
    mockUseQuery.mockReturnValue(undefined)
    
    render(<RecipeDetailPage params={{ id: 'test-recipe-1' }} />, { wrapper: TestWrapper })
    
    expect(screen.getByText('レシピが見つかりません')).toBeInTheDocument()
  })
})