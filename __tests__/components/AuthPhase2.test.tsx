import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import Auth from '@/components/Auth'

// Phase 2テスト用のモッククライアント
const mockConvex = new ConvexReactClient("https://mock.convex.cloud");

const MockConvexProvider = ({ children }: { children: React.ReactNode }) => (
  <ConvexProvider client={mockConvex}>
    <ConvexAuthProvider>
      {children}
    </ConvexAuthProvider>
  </ConvexProvider>
);

// Phase 2: 完全認証システムのモック
const mockSignIn = jest.fn();
const mockSignOut = jest.fn();
const mockUser = {
  _id: "user-123",
  name: "田中花子",
  email: "tanaka@example.com",
  role: "user" as const,
  isActive: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

jest.mock('@convex-dev/auth/react', () => ({
  useAuthActions: () => ({
    signIn: mockSignIn,
    signOut: mockSignOut,
  }),
  useCurrentUser: jest.fn(),
  ConvexAuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('Auth Component - Phase 2 (Authenticated User - Future Implementation)', () => {
  beforeEach(() => {
    const { useCurrentUser } = require('@convex-dev/auth/react');
    useCurrentUser.mockReturnValue(mockUser);
    jest.clearAllMocks();
  });

  // Phase 2.1では認証状態を一時的に無効化しているため、これらのテストはスキップ
  it.skip('should render user name when authenticated (Future)', () => {
    // Phase 2.2で有効化予定
    expect(true).toBe(true);
  });

  it.skip('should render logout button when authenticated (Future)', () => {
    // Phase 2.2で有効化予定
    expect(true).toBe(true);
  });

  it.skip('should call signOut when logout button is clicked (Future)', () => {
    // Phase 2.2で有効化予定
    expect(true).toBe(true);
  });
});

describe('Auth Component - Phase 2 (Unauthenticated User)', () => {
  beforeEach(() => {
    const { useCurrentUser } = require('@convex-dev/auth/react');
    useCurrentUser.mockReturnValue(null);
    jest.clearAllMocks();
  });

  it('should call signIn with google when login button is clicked', async () => {
    render(
      <MockConvexProvider>
        <Auth />
      </MockConvexProvider>
    );
    
    const loginButton = screen.getByText(/Googleでログイン/i);
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("google");
    });
  });

  it('should handle signIn errors gracefully', async () => {
    mockSignIn.mockRejectedValueOnce(new Error("OAuth error"));
    
    // alertのモック
    window.alert = jest.fn();
    
    render(
      <MockConvexProvider>
        <Auth />
      </MockConvexProvider>
    );
    
    const loginButton = screen.getByText(/Googleでログイン/i);
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("ログインに失敗しました。もう一度お試しください。");
    });
  });

  it('should render proper accessibility attributes', () => {
    render(
      <MockConvexProvider>
        <Auth />
      </MockConvexProvider>
    );
    
    const loginButton = screen.getByText(/Googleでログイン/i);
    expect(loginButton).toHaveAttribute('type', 'button');
  });
});