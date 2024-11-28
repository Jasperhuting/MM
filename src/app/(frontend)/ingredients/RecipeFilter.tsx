'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Recipe } from '@/payload-types'


type RecipeFilterProps = {
  recipes: Recipe[]
  onFilterChange: (recipes: string[]) => void
}

export const RecipeFilter: React.FC<RecipeFilterProps> = ({ recipes, onFilterChange }) => {
  const searchParams = useSearchParams()
  const initialRecipes = searchParams.get('recipes')?.split(',') || []
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>(initialRecipes)

  // Update selected recipes when URL changes
  useEffect(() => {
    const urlRecipes = searchParams.get('recipes')?.split(',') || []
    setSelectedRecipes(urlRecipes)
  }, [searchParams])

  const handleRecipeToggle = (recipeId: string) => {
    const newSelection = selectedRecipes.includes(recipeId)
      ? selectedRecipes.filter(id => id !== recipeId)
      : [...selectedRecipes, recipeId]
    
    setSelectedRecipes(newSelection)
    onFilterChange(newSelection)
  }

  return (
    <div>
      <span className="font-bold mb-2 block">Filter by Recipes</span>
      <div>
        <ul className="space-y-2">
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedRecipes.includes(recipe.id.toString())}
                  onChange={() => handleRecipeToggle(recipe.id.toString())}
                  className="rounded border-gray-300"
                />
                <span>{recipe.title}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
