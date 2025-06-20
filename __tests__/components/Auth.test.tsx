import { render, screen, fireEvent } from '@testing-library/react'
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import Auth from '@/components/Auth'

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
  useCurrentUser: () => null, // 初期状態では未ログイン
  ConvexAuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('Auth Component', () => {
  it('should render login button when not authenticated', () => {
    render(
      <MockConvexProvider>
        <Auth />
      </MockConvexProvider>
    );
    
    const loginButton = screen.getByText(/Googleでログイン/i);
    expect(loginButton).toBeInTheDocument();
  });

  it('should have proper styling for login button', () => {
    render(
      <MockConvexProvider>
        <Auth />
      </MockConvexProvider>
    );
    
    const loginButton = screen.getByText(/Googleでログイン/i);
    expect(loginButton).toHaveClass('wa-paper', 'wa-border');
  });

  it('should show welcome message for elderly users', () => {
    render(
      <MockConvexProvider>
        <Auth />
      </MockConvexProvider>
    );
    
    const welcomeMessage = screen.getByText(/はじめての方も安心/i);
    expect(welcomeMessage).toBeInTheDocument();
  });

  it('should display login instructions', () => {
    render(
      <MockConvexProvider>
        <Auth />
      </MockConvexProvider>
    );
    
    const instructions = screen.getByText(/Googleアカウントでかんたんログイン/i);
    expect(instructions).toBeInTheDocument();
  });
});