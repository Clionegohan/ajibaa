// レシピ関連の型定義
export interface Recipe {
  _id: string;
  title: string;
  description: string;
  story?: string;
  authorId: string;
  authorName?: string;
  prefecture: string;
  category: string;
  cookingTime: number;
  season?: string[];
  tags?: string[];
  imageUrl?: string;
  ingredients?: RecipeIngredient[];
  steps?: RecipeStep[];
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