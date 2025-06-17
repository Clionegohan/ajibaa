import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

// useQueryのモック
jest.mock('convex/react', () => ({
  ...jest.requireActual('convex/react'),
  useQuery: jest.fn(() => null), // Convexデータなし、サンプルデータを使用
}));

// Auth関連のモック
jest.mock('@convex-dev/auth/react', () => ({
  ...jest.requireActual('@convex-dev/auth/react'),
  useAuthActions: () => ({
    signIn: jest.fn(),
    signOut: jest.fn(),
  }),
  useCurrentUser: () => null,
  ConvexAuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('Home Page Prefecture Filter Integration', () => {
  it('should filter recipes by prefecture', async () => {
    const user = userEvent.setup();
    
    render(
      <MockConvexProvider>
        <Home />
      </MockConvexProvider>
    );
    
    // 初期状態では全レシピが表示される
    expect(screen.getByText('青森のりんご煮')).toBeInTheDocument();
    expect(screen.getByText('大阪のお好み焼き')).toBeInTheDocument();
    expect(screen.getByText('北海道のザンギ')).toBeInTheDocument();
    
    // 都道府県フィルターで青森県を選択
    const select = screen.getByRole('combobox', { name: /都道府県で絞り込み/i });
    await user.selectOptions(select, '青森県');
    
    // 青森県のレシピのみ表示される
    expect(screen.getByText('青森のりんご煮')).toBeInTheDocument();
    expect(screen.queryByText('大阪のお好み焼き')).not.toBeInTheDocument();
    expect(screen.queryByText('北海道のザンギ')).not.toBeInTheDocument();
    
    // フィルター解除ボタンが表示される
    expect(screen.getByRole('button', { name: /フィルターを解除/i })).toBeInTheDocument();
  });

  it('should reset filter when clear button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <MockConvexProvider>
        <Home />
      </MockConvexProvider>
    );
    
    // 青森県でフィルター
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '青森県');
    
    // フィルター解除ボタンをクリック
    const clearButton = screen.getByRole('button', { name: /フィルターを解除/i });
    await user.click(clearButton);
    
    // 全レシピが再び表示される
    expect(screen.getByText('青森のりんご煮')).toBeInTheDocument();
    expect(screen.getByText('大阪のお好み焼き')).toBeInTheDocument();
    expect(screen.getByText('北海道のザンギ')).toBeInTheDocument();
    
    // フィルター表示が消える
    expect(screen.queryByText(/青森県のレシピ/)).not.toBeInTheDocument();
  });

  it('should show prefecture counts in filter dropdown', () => {
    render(
      <MockConvexProvider>
        <Home />
      </MockConvexProvider>
    );
    
    // 各都道府県のレシピ数が表示される
    expect(screen.getByText('青森県 (1)')).toBeInTheDocument();
    expect(screen.getByText('大阪府 (1)')).toBeInTheDocument();
    expect(screen.getByText('北海道 (1)')).toBeInTheDocument();
  });
});