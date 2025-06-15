import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConvexProvider, ConvexReactClient } from "convex/react";
import RecipeForm from '@/components/RecipeForm'

// モッククライアント
const mockConvex = new ConvexReactClient("https://mock.convex.cloud");

const MockConvexProvider = ({ children }: { children: React.ReactNode }) => (
  <ConvexProvider client={mockConvex}>{children}</ConvexProvider>
);

// useMutationのモック
const mockCreateRecipe = jest.fn();
jest.mock('convex/react', () => ({
  ...jest.requireActual('convex/react'),
  useMutation: () => mockCreateRecipe,
}));

describe('RecipeForm Component', () => {
  beforeEach(() => {
    mockCreateRecipe.mockClear();
  });

  it('should render all required form fields', () => {
    render(
      <MockConvexProvider>
        <RecipeForm />
      </MockConvexProvider>
    );
    
    // 基本情報フィールド
    expect(screen.getByLabelText(/レシピ名/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/説明/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/都道府県/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/カテゴリ/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/難易度/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/調理時間/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/人数/i)).toBeInTheDocument();
  });

  it('should render ingredients section', () => {
    render(
      <MockConvexProvider>
        <RecipeForm />
      </MockConvexProvider>
    );
    
    expect(screen.getByText(/材料/i)).toBeInTheDocument();
    expect(screen.getByText(/材料を追加/i)).toBeInTheDocument();
  });

  it('should render cooking steps section', () => {
    render(
      <MockConvexProvider>
        <RecipeForm />
      </MockConvexProvider>
    );
    
    expect(screen.getByText(/作り方/i)).toBeInTheDocument();
    expect(screen.getByText(/手順を追加/i)).toBeInTheDocument();
  });

  it('should have submit button', () => {
    render(
      <MockConvexProvider>
        <RecipeForm />
      </MockConvexProvider>
    );
    
    const submitButton = screen.getByText(/レシピを投稿/i);
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveClass('wa-paper', 'wa-border');
  });

  it('should validate required fields', async () => {
    const user = userEvent.setup();
    
    render(
      <MockConvexProvider>
        <RecipeForm />
      </MockConvexProvider>
    );
    
    const submitButton = screen.getByText(/レシピを投稿/i);
    await user.click(submitButton);
    
    // バリデーションエラーメッセージが表示される
    expect(screen.getByText(/レシピ名を入力してください/i)).toBeInTheDocument();
  });

  it('should add ingredient when clicking add button', async () => {
    const user = userEvent.setup();
    
    render(
      <MockConvexProvider>
        <RecipeForm />
      </MockConvexProvider>
    );
    
    const addIngredientButton = screen.getByText(/材料を追加/i);
    await user.click(addIngredientButton);
    
    // 新しい材料入力フィールドが追加される
    const ingredientInputs = screen.getAllByPlaceholderText(/材料名/i);
    expect(ingredientInputs.length).toBeGreaterThan(1);
  });

  it('should add cooking step when clicking add button', async () => {
    const user = userEvent.setup();
    
    render(
      <MockConvexProvider>
        <RecipeForm />
      </MockConvexProvider>
    );
    
    const addStepButton = screen.getByText(/手順を追加/i);
    await user.click(addStepButton);
    
    // 新しい手順入力フィールドが追加される
    const stepInputs = screen.getAllByPlaceholderText(/手順の説明/i);
    expect(stepInputs.length).toBeGreaterThan(1);
  });
});