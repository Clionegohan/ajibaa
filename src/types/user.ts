// ユーザー関連の型定義
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  prefecture?: string;
  favoriteCategory?: string;
  recipeCount: number;
  followerCount: number;
  followingCount: number;
  joinedAt: number;
  isActive: boolean;
}

export interface UserProfile extends User {
  recipes?: string[]; // レシピIDの配列
  followers?: string[]; // フォロワーのユーザーIDの配列
  following?: string[]; // フォロー中のユーザーIDの配列
}