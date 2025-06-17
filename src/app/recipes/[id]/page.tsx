'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import RecipeDetail from '@/components/RecipeDetail';
import { notFound } from 'next/navigation';

interface RecipeDetailPageProps {
  params: {
    id: string;
  };
}

export default function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const recipeId = params.id as Id<'recipes'>;
  const recipe = useQuery(api.queries.getRecipeById, { recipeId });

  if (recipe === undefined) {
    return (
      <div className="min-h-screen bg-wa-cream flex items-center justify-center">
        <div className="wa-paper p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-wa-orange border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-wa-charcoal">レシピを読み込んでいます...</p>
        </div>
      </div>
    );
  }

  if (recipe === null) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-wa-cream">
      <RecipeDetail recipe={recipe} />
    </div>
  );
}