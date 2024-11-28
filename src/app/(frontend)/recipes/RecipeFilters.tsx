'use client'

import React from 'react'
import { IngredientsFilter } from './IngredientsFilter'
import { useRouter, useSearchParams } from 'next/navigation'
import { Ingredient } from '@/payload-types'

type RecipeFiltersProps = {
  ingredients: Ingredient[]
}

export const RecipeFilters: React.FC<RecipeFiltersProps> = ({ ingredients }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilterChange = (selectedIngredients: string[]) => {
    const params = new URLSearchParams(searchParams.toString())
    if (selectedIngredients.length > 0) {
      params.set('ingredients', selectedIngredients.join(','))
    } else {
      params.delete('ingredients')
    }
    // Use replace instead of push to trigger a full page refresh
    router.replace(`?${params.toString()}`)
  }

  return (
    <div className="col-span-3">
      <IngredientsFilter 
        ingredients={ingredients} 
        onFilterChange={handleFilterChange} 
      />
    </div>
  )
}
