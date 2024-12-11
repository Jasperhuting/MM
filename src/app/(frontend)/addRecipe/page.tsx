import { getPayload } from "payload"
import configPromise from '@payload-config'
import { redirect } from 'next/navigation'
import PageClient from "./page.client"
import { Recipe } from "@/payload-types"

type FormatType = "" | "left" | "start" | "center" | "right" | "end" | "justify"
type DirectionType = "ltr" | "rtl" | null;

export interface RecipeType {
  title: string;
  ingredients: number[];
  preparationTime: number;
  cookingInstructions: string[];
}

async function addIngredients(formData: FormData) {
  'use server'

  const measurements = ['grams', 'kilograms', 'liters', 'milliliters', 'amount', 'teaspoons', 'tablespoons'];
  
  try {
    const recipeText = formData.get('recipeText')
    if (typeof recipeText !== 'string') {
      throw new Error('No recipe text provided')
    }

    const parsedText = JSON.parse(recipeText)
    const payload = await getPayload({ config: configPromise })
    let ids = [] as number[];
    
    for (const ingredient of parsedText.ingredients || []) {
      const result = await payload.create({
        collection: 'ingredients',
        data: {
          title: ingredient.title,
          ingredientsAmount: ingredient.ingredientsAmount,
          measurements: measurements.includes(ingredient.measurements[0]) ? ingredient.measurements[0] : 'amount',
          _status: 'published' as const
        }
      })
      
      ids.push(result.id);
    }

    return {
        formData: parsedText,
        ids
    };
  } catch (error) {
    console.error('Error adding ingredients:', error)
    throw new Error('Failed to add ingredients')
  }
}
// formData: Recipe
async function addRecipe(recipe: RecipeType) {
  'use server'

//   console.log(formData)

  try {
    
    const payload = await getPayload({ config: configPromise })
    
    // First verify if ingredients exist
    const existingIngredients = await payload.find({
      collection: 'ingredients',
      where: {
        id: {
          in: recipe.ingredients
        }
      }
    });
    
    console.log('Found ingredients:', existingIngredients);
    
    if (existingIngredients.docs.length !== recipe.ingredients.length) {
      throw new Error('Some ingredients do not exist in the database');
    }

    const recipeData = {
      title: recipe.title,
      preparationTime: recipe.preparationTime,
      cookingInstructionsRaw: JSON.stringify(recipe.cookingInstructions),
      ingredients: existingIngredients.docs.map(doc => doc.id),
      _status: 'published' as const
    };
    
    console.log('Recipe data to be saved:', JSON.stringify(recipeData, null, 2));
    
    const result = await payload.create({
      collection: 'recipes',
      data: recipeData
    })

    console.log('Recipe created:', result);

    return undefined

    // console.log('Recipe saved:', test)
    
  } catch (error) {
    console.error('Error adding recipe:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    if (error.data) {
      console.error('Validation errors:', error.data)
    }
  }
}   


export default function AddRecipePage() {
  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Recept toevoegen</h1>
        </div>
      </div>
      <PageClient addIngredients={addIngredients} addRecipe={addRecipe} />
    </div>
  )
}
