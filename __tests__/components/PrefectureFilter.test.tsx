import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PrefectureFilter from '@/components/PrefectureFilter'

describe('PrefectureFilter Component', () => {
  const mockOnFilterChange = jest.fn();
  const mockRecipes = [
    { _id: '1', prefecture: '青森県', title: 'りんご煮' },
    { _id: '2', prefecture: '大阪府', title: 'お好み焼き' },
    { _id: '3', prefecture: '北海道', title: 'ザンギ' },
    { _id: '4', prefecture: '青森県', title: 'せんべい汁' },
  ];

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  it('should render prefecture filter dropdown', () => {
    render(
      <PrefectureFilter 
        recipes={mockRecipes} 
        selectedPrefecture=""
        onFilterChange={mockOnFilterChange}
      />
    );
    
    expect(screen.getByRole('combobox', { name: /都道府県で絞り込み/i })).toBeInTheDocument();
    expect(screen.getByText('すべての都道府県')).toBeInTheDocument();
  });

  it('should show unique prefectures from recipes', () => {
    render(
      <PrefectureFilter 
        recipes={mockRecipes} 
        selectedPrefecture=""
        onFilterChange={mockOnFilterChange}
      />
    );
    
    // ユニークな都道府県のみ表示される（カウント付き）
    expect(screen.getByText('青森県 (2)')).toBeInTheDocument();
    expect(screen.getByText('大阪府 (1)')).toBeInTheDocument();
    expect(screen.getByText('北海道 (1)')).toBeInTheDocument();
  });

  it('should call onFilterChange when prefecture is selected', async () => {
    const user = userEvent.setup();
    
    render(
      <PrefectureFilter 
        recipes={mockRecipes} 
        selectedPrefecture=""
        onFilterChange={mockOnFilterChange}
      />
    );
    
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '青森県');
    
    expect(mockOnFilterChange).toHaveBeenCalledWith('青森県');
  });

  it('should show recipe count for each prefecture', () => {
    render(
      <PrefectureFilter 
        recipes={mockRecipes} 
        selectedPrefecture=""
        onFilterChange={mockOnFilterChange}
      />
    );
    
    const select = screen.getByRole('combobox');
    fireEvent.click(select);
    
    // 青森県は2件のレシピがある
    expect(screen.getByText('青森県 (2)')).toBeInTheDocument();
    // 大阪府と北海道は1件ずつ
    expect(screen.getByText('大阪府 (1)')).toBeInTheDocument();
    expect(screen.getByText('北海道 (1)')).toBeInTheDocument();
  });

  it('should reset filter when "すべての都道府県" is selected', async () => {
    const user = userEvent.setup();
    
    render(
      <PrefectureFilter 
        recipes={mockRecipes} 
        selectedPrefecture="青森県"
        onFilterChange={mockOnFilterChange}
      />
    );
    
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '');
    
    expect(mockOnFilterChange).toHaveBeenCalledWith('');
  });
});