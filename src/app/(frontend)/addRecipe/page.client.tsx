'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useState } from 'react'
import { Button } from "@payloadcms/ui"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Recipe } from '@/payload-types'

interface PageClientProps {
  addIngredients: (formData: FormData) => Promise<{ formData: FormData; ids: number[]; }>
  addRecipe: (formData: { title: string; preparation: { preparationTime: string; steps: string[]; } }, ingredients: number[]) => Promise<void>
}

const defaultRecipe = `
        {
	"ingredients": [{
			"title": "pompoen",
			"ingredientsAmount": 1,
			"measurements": ["kilograms"]
		},
		{
			"title": "olijfolie",
			"ingredientsAmount": 2,
			"measurements": ["tablespoons"]
		},
		{
			"title": "ui",
			"ingredientsAmount": 1,
			"measurements": ["amount"]
		},
		{
			"title": "knoflook",
			"ingredientsAmount": 2,
			"measurements": ["cloves"]
		},
		{
			"title": "risottorijst",
			"ingredientsAmount": 200,
			"measurements": ["grams"]
		},
		{
			"title": "groentebouillon",
			"ingredientsAmount": 700,
			"measurements": ["mililiters"]
		},
		{
			"title": "edelgistvlokken",
			"ingredientsAmount": 3,
			"measurements": ["tablespoons"]
		},
		{
			"title": "verse peterselie",
			"ingredientsAmount": 1,
			"measurements": ["handful"]
		},
		{
			"title": "verse basilicum",
			"ingredientsAmount": 1,
			"measurements": ["handful"]
		},
		{
			"title": "zout en peper",
			"ingredientsAmount": 1,
			"measurements": ["to","taste"]
		}
	],
    "title": "Pompoenrisotto",
	"preparation": {
		"recipeType": "hoofdgerecht",
		"preparationTime": 40,
		"steps": [
			"Verwarm de oven voor op 200 graden.",
			"Snijd de pompoen in blokjes en meng met een beetje olijfolie. Rooster de pompoen in de oven in ongeveer 20 minuten gaar.",
			"Fruit ondertussen de ui en knoflook in een pan met olijfolie.",
			"Voeg de risottorijst toe en bak kort mee tot de korrels glazig zien.",
			"Voeg de groentebouillon beetje bij beetje toe en blijf regelmatig roeren tot de risotto gaar is (ongeveer 20 minuten).",
			"Roer de geroosterde pompoen, edelgistvlokken, verse kruiden en zout en peper door de risotto.",
			"Serveer de pompoenrisotto direct en geniet!"
		]
	}
}`

const PageClient: React.FC<PageClientProps> = ({ addIngredients, addRecipe }) => {
  const { setHeaderTheme } = useHeaderTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recipeText, setRecipeText] = useState(defaultRecipe)

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log(e);
    // e.preventDefault()
    // setIsLoading(true)
    // setError(null)

    // try {
    //   // Validate JSON
    //   JSON.parse(recipeText)
      
    //   const formData = new FormData()
    //   formData.append('recipeText', recipeText)
      
    //   await onSubmit(formData)
    // } catch (err) {
    //   setError(err instanceof Error ? err.message : 'Invalid JSON format')
    // } finally {
    //   setIsLoading(false)
    // }
  }

  const handleAddIngredients = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Validate JSON
      JSON.parse(recipeText)
      
      const formData = new FormData()
      formData.append('recipeText', recipeText)
      
      await addIngredients(formData).then(async (returnValue) => {
        console.log('returnValue', returnValue)
        console.log('formData', formData)
        await addRecipe(returnValue.formData, returnValue.ids)
      })

    

      setError('Ingredients added successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add ingredients')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container grid gap-8">
      <form onSubmit={handleSubmit} className="w-full">
        <Label>Recipe JSON</Label>
        <Textarea 
          value={recipeText}
          onChange={(e) => setRecipeText(e.target.value)}
          className="font-mono"
          rows={10}
        />
        <div className="flex gap-4 mt-4">
          <Button 
            type="button"
            disabled={isLoading}
            onClick={handleAddIngredients}
          >
            {isLoading ? 'Processing...' : 'Add Ingredients Only'}
          </Button>
        </div>
      </form>

      {error && (
        <div className={`mt-4 p-4 rounded-lg ${error.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {error}
        </div>
      )}

      {recipeText && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Recipe Preview:</h2>
          <div className="bg-gray-100 p-4 rounded-lg text-black">
            <pre className="whitespace-pre-wrap">{recipeText}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default PageClient
