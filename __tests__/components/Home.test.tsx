import { render, screen } from '@testing-library/react'
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import Home from '@/app/page'

// モッククライアント
const mockConvex = new ConvexReactClient("https://mock.convex.cloud");

const MockConvexProvider = ({ children }: { children: React.ReactNode }) => (
  <ConvexProvider client={mockConvex}>
    <ConvexAuthProvider>
      {children}
    </ConvexAuthProvider>
  </ConvexProvider>
);

// Phase 1: 認証機能のモック（簡素版）
jest.mock('@convex-dev/auth/react', () => ({
  useAuthActions: () => ({
    signIn: jest.fn(),
    signOut: jest.fn(),
  }),
  useCurrentUser: () => null,
  ConvexAuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// useQueryのモック
jest.mock('convex/react', () => ({
  ...jest.requireActual('convex/react'),
  useQuery: jest.fn(() => null),
}));

describe('Home Page', () => {
  it('should render the main title', () => {
    render(
      <MockConvexProvider>
        <Home />
      </MockConvexProvider>
    )
    
    const title = screen.getByRole('heading', { name: /味ばあ/i })
    expect(title).toBeInTheDocument()
  })

  it('should render the subtitle', () => {
    render(
      <MockConvexProvider>
        <Home />
      </MockConvexProvider>
    )
    
    const subtitle = screen.getByText(/おばあちゃんの味を次世代へ/i)
    expect(subtitle).toBeInTheDocument()
  })

  it('should have proper styling classes', () => {
    render(
      <MockConvexProvider>
        <Home />
      </MockConvexProvider>
    )
    
    const main = screen.getByRole('main')
    expect(main).toHaveClass('min-h-screen', 'bg-wa-cream')
  })

  it('should display sample recipes', () => {
    render(
      <MockConvexProvider>
        <Home />
      </MockConvexProvider>
    )
    
    // サンプルレシピが表示されることを確認
    expect(screen.getByText('青森のりんご煮')).toBeInTheDocument()
    expect(screen.getByText('大阪のお好み焼き')).toBeInTheDocument()
    expect(screen.getByText('北海道のザンギ')).toBeInTheDocument()
  })
})