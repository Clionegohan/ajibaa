// レシピ関連の型定義
export interface Recipe {
  _id: string;
  title: string;
  description: string;
  story?: string;
  authorId: string;
  prefecture: string;
  category: string;
  difficulty: number;
  cookingTime: number;
  servings: number;
  season?: string[];
  tags?: string[];
  imageUrl?: string;
  isPublished: boolean;
  viewCount: number;
  likeCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface RecipeIngredient {
  _id: string;
  recipeId: string;
  name: string;
  amount: string;
  unit?: string;
  note?: string;
  order: number;
}

export interface RecipeStep {
  _id: string;
  recipeId: string;
  stepNumber: number;
  instruction: string;
  imageUrl?: string;
  tips?: string;
}