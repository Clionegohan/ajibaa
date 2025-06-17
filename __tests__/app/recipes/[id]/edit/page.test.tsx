import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ConvexReactClient } from 'convex/react'
import { ConvexProvider } from 'convex/react'
import RecipeEditPage from '@/app/recipes/[id]/edit/page'
import { Recipe } from '@/types/recipe'

// Mock useQuery and useMutation
jest.mock('convex/react', () => ({
  ...jest.requireActual('convex/react'),
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}))

const mockRecipe: Recipe = {
  _id: "test-recipe-1",
  title: "青森のりんご煮",
  description: "おばあちゃんの優しいりんご煮",
  story: "寒い冬の日に、ストーブの上でコトコト煮てくれた",
  authorId: "user1",
  authorName: "田中花子",
  prefecture: "青森県",
  category: "おやつ・デザート",
  difficulty: 2,
  cookingTime: 30,
  servings: 4,
  season: ["秋", "冬"],
  tags: ["りんご", "郷土料理"],
  ingredients: [
    {
      _id: "ing-1",
      recipeId: "test-recipe-1",
      name: "りんご",
      amount: "3",
      unit: "個",
      order: 1
    }
  ],
  steps: [
    {
      _id: "step-1",
      recipeId: "test-recipe-1",
      stepNumber: 1,
      instruction: "りんごを皮をむいて8等分に切る"
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

describe('RecipeEditPage', () => {
  const mockUseQuery = require('convex/react').useQuery
  const mockUseMutation = require('convex/react').useMutation
  const mockUpdateRecipe = jest.fn()

  beforeEach(() => {
    mockUseQuery.mockReturnValue(mockRecipe)
    mockUseMutation.mockReturnValue(mockUpdateRecipe)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render recipe edit form with existing data', () => {
    render(<RecipeEditPage params={{ id: 'test-recipe-1' }} />, { wrapper: TestWrapper })
    
    expect(screen.getByDisplayValue('青森のりんご煮')).toBeInTheDocument()
    expect(screen.getByDisplayValue('おばあちゃんの優しいりんご煮')).toBeInTheDocument()
    expect(screen.getByDisplayValue('寒い冬の日に、ストーブの上でコトコト煮てくれた')).toBeInTheDocument()
  })

  it('should render ingredients editing section', () => {
    render(<RecipeEditPage params={{ id: 'test-recipe-1' }} />, { wrapper: TestWrapper })
    
    expect(screen.getByText('材料')).toBeInTheDocument()
    expect(screen.getByDisplayValue('りんご')).toBeInTheDocument()
    expect(screen.getByDisplayValue('3')).toBeInTheDocument()
  })

  it('should render steps editing section', () => {
    render(<RecipeEditPage params={{ id: 'test-recipe-1' }} />, { wrapper: TestWrapper })
    
    expect(screen.getByText('作り方')).toBeInTheDocument()
    expect(screen.getByDisplayValue('りんごを皮をむいて8等分に切る')).toBeInTheDocument()
  })

  it('should have save and delete buttons', () => {
    render(<RecipeEditPage params={{ id: 'test-recipe-1' }} />, { wrapper: TestWrapper })
    
    expect(screen.getByText('保存')).toBeInTheDocument()
    expect(screen.getByText('削除')).toBeInTheDocument()
  })

  it('should have draft save button', () => {
    render(<RecipeEditPage params={{ id: 'test-recipe-1' }} />, { wrapper: TestWrapper })
    
    expect(screen.getByText('下書き保存')).toBeInTheDocument()
  })

  it('should call update mutation when save button is clicked', () => {
    render(<RecipeEditPage params={{ id: 'test-recipe-1' }} />, { wrapper: TestWrapper })
    
    const saveButton = screen.getByText('保存')
    fireEvent.click(saveButton)
    
    expect(mockUpdateRecipe).toHaveBeenCalled()
  })

  it('should show confirmation dialog when delete button is clicked', () => {
    render(<RecipeEditPage params={{ id: 'test-recipe-1' }} />, { wrapper: TestWrapper })
    
    const deleteButton = screen.getByText('削除')
    fireEvent.click(deleteButton)
    
    expect(screen.getByText('本当に削除しますか？')).toBeInTheDocument()
  })

  it('should render loading state when recipe is not loaded', () => {
    mockUseQuery.mockReturnValue(null)
    
    render(<RecipeEditPage params={{ id: 'test-recipe-1' }} />, { wrapper: TestWrapper })
    
    expect(screen.getByText('レシピを読み込み中...')).toBeInTheDocument()
  })

  it('should render not found state when recipe does not exist', () => {
    mockUseQuery.mockReturnValue(undefined)
    
    render(<RecipeEditPage params={{ id: 'test-recipe-1' }} />, { wrapper: TestWrapper })
    
    expect(screen.getByText('レシピが見つかりません')).toBeInTheDocument()
  })
})