import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ConvexProvider, ConvexReactClient } from "convex/react";
import AdvancedSearch from '@/components/AdvancedSearch'

const mockConvex = new ConvexReactClient("https://mock.convex.cloud");

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ConvexProvider client={mockConvex}>
    {children}
  </ConvexProvider>
);

// Mock data
const mockPrefectureStats = [
  { prefecture: "北海道", count: 15 },
  { prefecture: "青森県", count: 12 },
  { prefecture: "東京都", count: 20 }
];

const mockCategoryStats = [
  { category: "主食", count: 25 },
  { category: "副菜", count: 18 },
  { category: "汁物", count: 10 }
];

const mockPopularTags = [
  { tag: "おばあちゃんの味", count: 30 },
  { tag: "郷土料理", count: 25 },
  { tag: "家庭料理", count: 20 }
];

const mockSearchResults = [
  {
    _id: "recipe-1",
    title: "青森のりんご煮",
    description: "おばあちゃんの優しいりんご煮",
    prefecture: "青森県",
    category: "おやつ・デザート",
    cookingTime: 30,
    tags: ["りんご", "郷土料理"],
    likeCount: 15,
    viewCount: 100
  }
];

// Mock Convex hooks
jest.mock('convex/react', () => ({
  ...jest.requireActual('convex/react'),
  useQuery: jest.fn((query) => {
    const queryString = query?.toString() || '';
    if (queryString.includes('getRecipeStatsByPrefecture')) {
      return mockPrefectureStats;
    }
    if (queryString.includes('getRecipeStatsByCategory')) {
      return mockCategoryStats;
    }
    if (queryString.includes('getPopularTags')) {
      return mockPopularTags;
    }
    if (queryString.includes('searchRecipes')) {
      return mockSearchResults;
    }
    return null;
  }),
}));

describe('AdvancedSearch Component', () => {
  const mockOnSearchResults = jest.fn();
  const mockOnFiltersChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render basic search input', () => {
    render(
      <TestWrapper>
        <AdvancedSearch 
          onSearchResults={mockOnSearchResults}
          onFiltersChange={mockOnFiltersChange}
        />
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText(/レシピを検索/)).toBeInTheDocument();
    expect(screen.getByText('詳細検索')).toBeInTheDocument();
  });

  it('should handle text search input', async () => {
    render(
      <TestWrapper>
        <AdvancedSearch 
          onSearchResults={mockOnSearchResults}
          onFiltersChange={mockOnFiltersChange}
        />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText(/レシピを検索/);
    fireEvent.change(searchInput, { target: { value: 'りんご' } });

    expect(searchInput).toHaveValue('りんご');

    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalled();
    });
  });

  it('should expand and show advanced filters', () => {
    render(
      <TestWrapper>
        <AdvancedSearch 
          onSearchResults={mockOnSearchResults}
          onFiltersChange={mockOnFiltersChange}
        />
      </TestWrapper>
    );

    const advancedButton = screen.getByText('詳細検索');
    fireEvent.click(advancedButton);

    expect(screen.getByText('🗾 都道府県')).toBeInTheDocument();
    expect(screen.getByText('🍳 カテゴリ')).toBeInTheDocument();
    expect(screen.getByText('🌸 季節')).toBeInTheDocument();
    expect(screen.getByText('⏱️ 調理時間（最大）')).toBeInTheDocument();
    expect(screen.getByText('📊 並び順')).toBeInTheDocument();
  });

  it('should show prefecture options with counts', () => {
    render(
      <TestWrapper>
        <AdvancedSearch 
          onSearchResults={mockOnSearchResults}
          onFiltersChange={mockOnFiltersChange}
        />
      </TestWrapper>
    );

    // 詳細検索を展開
    fireEvent.click(screen.getByText('詳細検索'));

    // 都道府県セレクトボックスをクリック
    const prefectureSelect = screen.getByLabelText(/都道府県/);
    expect(prefectureSelect).toBeInTheDocument();
    
    // オプションが正しく表示されることを確認
    expect(screen.getByText('北海道 (15件)')).toBeInTheDocument();
    expect(screen.getByText('青森県 (12件)')).toBeInTheDocument();
    expect(screen.getByText('東京都 (20件)')).toBeInTheDocument();
  });

  it('should show category options with counts', () => {
    render(
      <TestWrapper>
        <AdvancedSearch 
          onSearchResults={mockOnSearchResults}
          onFiltersChange={mockOnFiltersChange}
        />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('詳細検索'));

    expect(screen.getByText('主食 (25件)')).toBeInTheDocument();
    expect(screen.getByText('副菜 (18件)')).toBeInTheDocument();
    expect(screen.getByText('汁物 (10件)')).toBeInTheDocument();
  });

  it('should show popular tags', () => {
    render(
      <TestWrapper>
        <AdvancedSearch 
          onSearchResults={mockOnSearchResults}
          onFiltersChange={mockOnFiltersChange}
        />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('詳細検索'));

    expect(screen.getByText('🏷️ タグで絞り込み')).toBeInTheDocument();
    expect(screen.getByText('おばあちゃんの味 (30)')).toBeInTheDocument();
    expect(screen.getByText('郷土料理 (25)')).toBeInTheDocument();
    expect(screen.getByText('家庭料理 (20)')).toBeInTheDocument();
  });

  it('should handle tag selection', async () => {
    render(
      <TestWrapper>
        <AdvancedSearch 
          onSearchResults={mockOnSearchResults}
          onFiltersChange={mockOnFiltersChange}
        />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('詳細検索'));

    const tagButton = screen.getByText('おばあちゃんの味 (30)');
    fireEvent.click(tagButton);

    // タグが選択状態になることを確認
    expect(tagButton).toHaveClass('bg-wa-orange');

    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalled();
    });
  });

  it('should handle filter changes', async () => {
    render(
      <TestWrapper>
        <AdvancedSearch 
          onSearchResults={mockOnSearchResults}
          onFiltersChange={mockOnFiltersChange}
        />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('詳細検索'));

    // 都道府県フィルタを変更
    const prefectureSelect = screen.getByLabelText(/都道府県/);
    fireEvent.change(prefectureSelect, { target: { value: '北海道' } });

    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalled();
    });
  });

  it('should show clear button when filters are active', () => {
    render(
      <TestWrapper>
        <AdvancedSearch 
          onSearchResults={mockOnSearchResults}
          onFiltersChange={mockOnFiltersChange}
        />
      </TestWrapper>
    );

    // 検索クエリを入力
    const searchInput = screen.getByPlaceholderText(/レシピを検索/);
    fireEvent.change(searchInput, { target: { value: 'テスト' } });

    // クリアボタンが表示されることを確認
    expect(screen.getByText('クリア')).toBeInTheDocument();
  });

  it('should clear all filters when clear button is clicked', async () => {
    render(
      <TestWrapper>
        <AdvancedSearch 
          onSearchResults={mockOnSearchResults}
          onFiltersChange={mockOnFiltersChange}
        />
      </TestWrapper>
    );

    // フィルタを設定
    const searchInput = screen.getByPlaceholderText(/レシピを検索/);
    fireEvent.change(searchInput, { target: { value: 'テスト' } });

    // クリアボタンをクリック
    const clearButton = screen.getByText('クリア');
    fireEvent.click(clearButton);

    // 検索フィールドがクリアされることを確認
    expect(searchInput).toHaveValue('');
  });

  it('should show search results count', () => {
    render(
      <TestWrapper>
        <AdvancedSearch 
          onSearchResults={mockOnSearchResults}
          onFiltersChange={mockOnFiltersChange}
        />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('詳細検索'));

    expect(screen.getByText('1件のレシピが見つかりました')).toBeInTheDocument();
  });

  it('should call onSearchResults when search results change', async () => {
    render(
      <TestWrapper>
        <AdvancedSearch 
          onSearchResults={mockOnSearchResults}
          onFiltersChange={mockOnFiltersChange}
        />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(mockOnSearchResults).toHaveBeenCalledWith(mockSearchResults);
    });
  });
});