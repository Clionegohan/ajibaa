import { render, screen } from '@testing-library/react';
import { ConvexReactClient } from 'convex/react';
import { ConvexProvider } from 'convex/react';
import RecipeDetail from '@/components/RecipeDetail';
import { mockRecipeDetail } from '@/lib/testData';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ConvexProvider client={new ConvexReactClient('https://test.convex.dev')}>
    {children}
  </ConvexProvider>
);

describe('RecipeDetail', () => {
  it('should render recipe title and description', () => {
    render(
      <RecipeDetail recipe={mockRecipeDetail} />, 
      { wrapper: TestWrapper }
    );
    
    expect(screen.getByText('おばあちゃんの炊き込みご飯')).toBeInTheDocument();
    expect(screen.getByText(/昔から家族に愛され続けている/)).toBeInTheDocument();
  });

  it('should display recipe metadata', () => {
    render(
      <RecipeDetail recipe={mockRecipeDetail} />, 
      { wrapper: TestWrapper }
    );
    
    expect(screen.getByText(/新潟県/)).toBeInTheDocument();
    expect(screen.getByText(/ご飯もの/)).toBeInTheDocument();
    expect(screen.getByText(/60分/)).toBeInTheDocument();
    expect(screen.getByText(/田中花子/)).toBeInTheDocument();
  });

  it('should display recipe story when provided', () => {
    render(
      <RecipeDetail recipe={mockRecipeDetail} />, 
      { wrapper: TestWrapper }
    );
    
    expect(screen.getByText(/この炊き込みご飯は、私が子供の頃から/)).toBeInTheDocument();
  });

  it('should display ingredients list', () => {
    render(
      <RecipeDetail recipe={mockRecipeDetail} />, 
      { wrapper: TestWrapper }
    );
    
    expect(screen.getByText('🥄 材料')).toBeInTheDocument();
    expect(screen.getAllByText(/米/).length).toBeGreaterThan(0);
    expect(screen.getByText('2 合')).toBeInTheDocument();
    expect(screen.getAllByText(/醤油/).length).toBeGreaterThan(0);
    expect(screen.getByText(/大さじ3/)).toBeInTheDocument();
  });

  it('should display cooking steps', () => {
    render(
      <RecipeDetail recipe={mockRecipeDetail} />, 
      { wrapper: TestWrapper }
    );
    
    expect(screen.getByText('👩‍🍳 作り方')).toBeInTheDocument();
    expect(screen.getByText(/米をといで30分以上水に浸します/)).toBeInTheDocument();
    expect(screen.getByText(/具材を食べやすい大きさに切ります/)).toBeInTheDocument();
  });

  it('should display cooking tips when provided', () => {
    render(
      <RecipeDetail recipe={mockRecipeDetail} />, 
      { wrapper: TestWrapper }
    );
    
    expect(screen.getByText(/水に浸すことでふっくらと炊き上がります/)).toBeInTheDocument();
  });

  it('should display tags', () => {
    render(
      <RecipeDetail recipe={mockRecipeDetail} />, 
      { wrapper: TestWrapper }
    );
    
    expect(screen.getByText('家庭料理')).toBeInTheDocument();
    expect(screen.getByText('郷土料理')).toBeInTheDocument();
    expect(screen.getByText('おふくろの味')).toBeInTheDocument();
  });

  it('should display view and like counts', () => {
    render(
      <RecipeDetail recipe={mockRecipeDetail} />, 
      { wrapper: TestWrapper }
    );
    
    expect(screen.getByText(/1240/)).toBeInTheDocument(); // view count
    expect(screen.getByText(/89/)).toBeInTheDocument(); // like count
  });

  it('should include like button', () => {
    render(
      <RecipeDetail recipe={mockRecipeDetail} />, 
      { wrapper: TestWrapper }
    );
    
    const likeButton = screen.getByLabelText(/いいね/);
    expect(likeButton).toBeInTheDocument();
  });

  it('should handle recipe without story gracefully', () => {
    const recipeWithoutStory = { 
      ...mockRecipeDetail, 
      story: undefined 
    };
    
    render(
      <RecipeDetail recipe={recipeWithoutStory} />, 
      { wrapper: TestWrapper }
    );
    
    expect(screen.getByText('おばあちゃんの炊き込みご飯')).toBeInTheDocument();
    expect(screen.queryByText(/この炊き込みご飯は、私が子供の頃から/)).not.toBeInTheDocument();
  });

  it('should handle recipe without ingredients gracefully', () => {
    const recipeWithoutIngredients = { 
      ...mockRecipeDetail, 
      ingredients: [] 
    };
    
    render(
      <RecipeDetail recipe={recipeWithoutIngredients} />, 
      { wrapper: TestWrapper }
    );
    
    expect(screen.getByText('🥄 材料')).toBeInTheDocument();
    expect(screen.getByText(/材料情報はまだ登録されていません/)).toBeInTheDocument();
  });

  it('should handle recipe without steps gracefully', () => {
    const recipeWithoutSteps = { 
      ...mockRecipeDetail, 
      steps: [] 
    };
    
    render(
      <RecipeDetail recipe={recipeWithoutSteps} />, 
      { wrapper: TestWrapper }
    );
    
    expect(screen.getByText('👩‍🍳 作り方')).toBeInTheDocument();
    expect(screen.queryByText(/米をといで30分以上水に浸します/)).not.toBeInTheDocument();
  });
});