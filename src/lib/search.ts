import { Recipe } from '@/types/recipe'

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, (match) => String.fromCharCode(match.charCodeAt(0) - 0x60))
}

export function searchRecipes(recipes: Recipe[], query: string): Recipe[] {
  if (!query.trim()) {
    return recipes
  }

  const normalizedQuery = normalizeText(query)

  return recipes.filter(recipe => {
    const searchableText = normalizeText([
      recipe.title,
      recipe.description,
      recipe.story || '',
      ...(recipe.tags || [])
    ].join(' '))

    return searchableText.includes(normalizedQuery)
  })
}