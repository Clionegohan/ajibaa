import { searchRecipes } from '@/lib/search'
import { Recipe } from '@/types/recipe'

const mockRecipes: Recipe[] = [
  {
    _id: "1",
    title: "青森のりんご煮",
    description: "おばあちゃんの優しいりんご煮",
    story: "寒い冬の日に、ストーブの上でコトコト煮てくれた",
    authorId: "user1",
    prefecture: "青森県",
    category: "おやつ・デザート",
    difficulty: 2,
    cookingTime: 30,
    servings: 4,
    season: ["秋", "冬"],
    tags: ["りんご", "郷土料理", "おばあちゃんの味"],
    isPublished: true,
    viewCount: 150,
    likeCount: 23,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: "2",
    title: "大阪のお好み焼き",
    description: "関西風の本格お好み焼き",
    authorId: "user2",
    prefecture: "大阪府",
    category: "主食",
    difficulty: 3,
    cookingTime: 45,
    servings: 2,
    tags: ["粉もん", "関西", "ソース"],
    isPublished: true,
    viewCount: 200,
    likeCount: 45,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: "3",
    title: "北海道のザンギ",
    description: "北海道民のソウルフード。醤油ベースの下味がきいた唐揚げ",
    authorId: "user3",
    prefecture: "北海道",
    category: "副菜",
    difficulty: 3,
    cookingTime: 40,
    servings: 3,
    season: ["通年"],
    tags: ["鶏肉", "北海道", "居酒屋"],
    isPublished: true,
    viewCount: 180,
    likeCount: 32,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
]

describe('searchRecipes', () => {
  it('should return all recipes when query is empty', () => {
    const result = searchRecipes(mockRecipes, '')
    expect(result).toEqual(mockRecipes)
  })

  it('should search by recipe title', () => {
    const result = searchRecipes(mockRecipes, 'りんご')
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('青森のりんご煮')
  })

  it('should search by description', () => {
    const result = searchRecipes(mockRecipes, '関西風')
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('大阪のお好み焼き')
  })

  it('should search by tags', () => {
    const result = searchRecipes(mockRecipes, '郷土料理')
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('青森のりんご煮')
  })

  it('should search by story', () => {
    const result = searchRecipes(mockRecipes, 'ストーブ')
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('青森のりんご煮')
  })

  it('should be case insensitive', () => {
    const result = searchRecipes(mockRecipes, 'リンゴ')
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('青森のりんご煮')
  })

  it('should search across multiple fields', () => {
    const result = searchRecipes(mockRecipes, '北海道')
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('北海道のザンギ')
  })

  it('should return empty array when no matches found', () => {
    const result = searchRecipes(mockRecipes, '存在しないキーワード')
    expect(result).toHaveLength(0)
  })

  it('should handle partial matches', () => {
    const result = searchRecipes(mockRecipes, 'お好み')
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('大阪のお好み焼き')
  })
})