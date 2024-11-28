'use client'

import { Ingredient } from '@/payload-types'
import { useSearchParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'



type IngredientsFilterProps = {
  ingredients: Ingredient[]
  onFilterChange: (ingredients: string[]) => void
}

export const IngredientsFilter: React.FC<IngredientsFilterProps> = ({ ingredients, onFilterChange }) => {
  const searchParams = useSearchParams()
  const initialIngredients = searchParams.get('ingredients')?.split(',') || []
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(initialIngredients)

  // Update selected ingredients when URL changes
  useEffect(() => {
    const urlIngredients = searchParams.get('ingredients')?.split(',') || []
    setSelectedIngredients(urlIngredients)
  }, [searchParams])

  const handleIngredientToggle = (ingredientId: string) => {
    const newSelection = selectedIngredients.includes(ingredientId)
      ? selectedIngredients.filter(id => id !== ingredientId)
      : [...selectedIngredients, ingredientId]
    
    setSelectedIngredients(newSelection)
    onFilterChange(newSelection)
  }

  return (
    <div>
      <span className="font-bold mb-2 block">Filter by Ingredients</span>
      <div>
        <ul className="space-y-2">
          {ingredients.map((ingredient) => (
            <li key={ingredient.id}>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedIngredients.includes(String(ingredient.id))}
                  onChange={() => handleIngredientToggle(String(ingredient.id))}
                  className="rounded border-gray-300"
                />
                <span>{ingredient.title}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
