import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ConvexReactClient } from 'convex/react'
import { ConvexProvider } from 'convex/react'
import UserProfilePage from '@/app/profile/[id]/page'
import { UserProfile } from '@/types/user'

// Mock useQuery
jest.mock('convex/react', () => ({
  ...jest.requireActual('convex/react'),
  useQuery: jest.fn(),
}))

const mockUser: UserProfile = {
  _id: "user-1",
  name: "田中花子",
  email: "hanako@example.com",
  avatar: "https://example.com/avatar.jpg",
  bio: "青森出身のおばあちゃんです。郷土料理を次世代に伝えたいと思っています。",
  prefecture: "青森県",
  favoriteCategory: "郷土料理",
  recipeCount: 15,
  followerCount: 120,
  followingCount: 45,
  joinedAt: Date.now() - 86400000 * 365, // 1年前
  isActive: true,
  recipes: ["recipe-1", "recipe-2", "recipe-3"],
  followers: ["user-2", "user-3"],
  following: ["user-4", "user-5"]
}

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ConvexProvider client={new ConvexReactClient("https://test.convex.cloud")}>
    {children}
  </ConvexProvider>
)

describe('UserProfilePage', () => {
  const mockUseQuery = require('convex/react').useQuery

  beforeEach(() => {
    mockUseQuery.mockReturnValue(mockUser)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render user name and bio', () => {
    render(<UserProfilePage params={{ id: 'user-1' }} />, { wrapper: TestWrapper })
    
    expect(screen.getByText('田中花子')).toBeInTheDocument()
    expect(screen.getByText('青森出身のおばあちゃんです。郷土料理を次世代に伝えたいと思っています。')).toBeInTheDocument()
  })

  it('should render user statistics', () => {
    render(<UserProfilePage params={{ id: 'user-1' }} />, { wrapper: TestWrapper })
    
    expect(screen.getByText('15')).toBeInTheDocument() // recipe count
    expect(screen.getByText('120')).toBeInTheDocument() // follower count
    expect(screen.getByText('45')).toBeInTheDocument() // following count
  })

  it('should render user prefecture and favorite category', () => {
    render(<UserProfilePage params={{ id: 'user-1' }} />, { wrapper: TestWrapper })
    
    expect(screen.getByText(/📍 青森県/)).toBeInTheDocument()
    expect(screen.getByText(/好きなカテゴリ: 郷土料理/)).toBeInTheDocument()
  })

  it('should render loading state when user is not loaded', () => {
    mockUseQuery.mockReturnValue(null)
    
    render(<UserProfilePage params={{ id: 'user-1' }} />, { wrapper: TestWrapper })
    
    expect(screen.getByText('プロフィールを読み込み中...')).toBeInTheDocument()
  })

  it('should render not found state when user does not exist', () => {
    mockUseQuery.mockReturnValue(undefined)
    
    render(<UserProfilePage params={{ id: 'user-1' }} />, { wrapper: TestWrapper })
    
    expect(screen.getByText('ユーザーが見つかりません')).toBeInTheDocument()
  })

  it('should render follow button for other users', () => {
    render(<UserProfilePage params={{ id: 'user-1' }} />, { wrapper: TestWrapper })
    
    expect(screen.getByText('フォロー')).toBeInTheDocument()
  })

  it('should show join date', () => {
    render(<UserProfilePage params={{ id: 'user-1' }} />, { wrapper: TestWrapper })
    
    // 参加日が表示されることを確認（具体的な日付はテスト実行時によって変わるので存在確認のみ）
    expect(screen.getByText(/参加日:/)).toBeInTheDocument()
  })

  it('should show recent recipes section', () => {
    render(<UserProfilePage params={{ id: 'user-1' }} />, { wrapper: TestWrapper })
    
    expect(screen.getByText('投稿したレシピ')).toBeInTheDocument()
  })
})