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

describe('Convex Connection Test', () => {
  it('should render development status section', () => {
    render(
      <MockConvexProvider>
        <Home />
      </MockConvexProvider>
    );
    
    const developmentStatus = screen.getByText(/開発状況/i);
    expect(developmentStatus).toBeInTheDocument();
  });

  it('should show loading state initially', () => {
    render(
      <MockConvexProvider>
        <Home />
      </MockConvexProvider>
    );
    
    const loadingText = screen.getByText(/接続中.../i);
    expect(loadingText).toBeInTheDocument();
  });

  it('should show data source information', () => {
    render(
      <MockConvexProvider>
        <Home />
      </MockConvexProvider>
    );
    
    const dataSource = screen.getByText(/データソース: サンプルデータ/i);
    expect(dataSource).toBeInTheDocument();
  });
});