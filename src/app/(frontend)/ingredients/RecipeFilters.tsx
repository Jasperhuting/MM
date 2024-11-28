'use client'

import React from 'react'
import { RecipeFilter } from './RecipeFilter'
import { useRouter, useSearchParams } from 'next/navigation'
import { Recipe } from '@/payload-types'

type RecipeFiltersProps = {
  recipes: Recipe[]
}

export const RecipeFilters: React.FC<RecipeFiltersProps> = ({ recipes }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilterChange = (selectedRecipes: string[]) => {
    const params = new URLSearchParams(searchParams.toString())
    if (selectedRecipes.length > 0) {
      params.set('recipes', selectedRecipes.join(','))
    } else {
      params.delete('recipes')
    }
    // Use replace instead of push to trigger a full page refresh
    router.replace(`?${params.toString()}`)
  }

  return (
    <div className="col-span-3">
      <RecipeFilter 
        recipes={recipes} 
        onFilterChange={handleFilterChange} 
      />
    </div>
  )
}
