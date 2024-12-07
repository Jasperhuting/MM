import { getPayload } from "payload"
import configPromise from '@payload-config'
import { redirect } from 'next/navigation'
import PageClient from "./page.client"

type FormatType = "" | "left" | "start" | "center" | "right" | "end" | "justify"
type DirectionType = "ltr" | "rtl" | null;

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

async function addRecipe(formData: { title: string; preparation: { preparationTime: string; steps: string[]; } }, ingredients: number[]) {
  'use server'

  debugger;

  try {
    

    

    
    const payload = await getPayload({ config: configPromise })
    
    // Create the data object first so we can inspect it
    const recipeData = {
      title: formData.title,
      ingredients: [...ingredients],
      authors: [1],
      image: 8,
      cookingInstructions: {
        "root": {
            "children": [
                {
                    "children": [
                        {
                            "detail": 0,
                            "format": "" as FormatType,
                            "mode": "normal",
                            "style": "",
                            "text": "asdsa",
                            "type": "text",
                            "version": 1
                        }
                    ],
                    "direction": "ltr" as DirectionType,
                    "format": "" as FormatType,
                    "indent": 0,
                    "type": "paragraph",
                    "version": 1,
                    "textFormat": 0,
                    "textStyle": ""
                },
                {
                    "children": [],
                    "direction": null as DirectionType,
                    "format": "" as FormatType,
                    "indent": 0,
                    "type": "paragraph",
                    "version": 1,
                    "textFormat": 0,
                    "textStyle": ""
                },
                {
                    "format": "" as FormatType,
                    "type": "block",
                    "version": 2,
                    "fields": {
                        "id": "674f6a63e3ccf828e3d9d6dc",
                        "blockName": "",
                        "arrayField": [
                            {
                                "id": "674f6a66e7e99b6cd1b61e19",
                                "step": "1",
                                "stepcontent": {
                                    "root": {
                                        "children": [
                                            {
                                                "children": [
                                                    {
                                                        "detail": 0,
                                                        "format": 0,
                                                        "mode": "normal",
                                                        "style": "",
                                                        "text": "dat weet ik nog niet",
                                                        "type": "text",
                                                        "version": 1
                                                    }
                                                ],
                                                "direction": "ltr" as DirectionType,
                                                "format": "" as FormatType,
                                                "indent": 0,
                                                "type": "paragraph",
                                                "version": 1,
                                                "textFormat": 0,
                                                "textStyle": ""
                                            }
                                        ],
                                        "direction": "ltr" as DirectionType,
                                        "format": "" as FormatType,
                                        "indent": 0,
                                        "type": "root",
                                        "version": 1
                                    }
                                }
                            }
                        ],
                        "blockType": "stepBlock"
                    }
                }
            ],
            "direction": "ltr" as DirectionType,
            "format": "" as FormatType,
            "indent": 0,
            "type": "root",
            "version": 1
        }
    },
      preparationTime: String(formData.preparation.preparationTime),
      _status: 'published' as const,
    }

    const tempRecipeData = {
        "slug": "pompoenrisotto",
        "title": "Pompoenrisotto",
        "image": 8,
        "_status": "published",
        "authors": [1],
        "slugLock": true,
        "updatedAt": "2024-12-03T21:37:24.644Z",
        "createdAt": "2024-12-03T21:37:24.644Z",
        "categories": [],
        "publishedAt": "2024-12-03T21:37:24.643Z",
        "ingredients": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        "totalRatings": null,
        "averageRating": null,
        "preparationTime": "40",
        "relatedIngredients": [],
        "cookingInstructions": {
          "root": {
            "children": [
              {
                "children": [
                  {
                    "detail": 0,
                    "mode": "normal",
                    "style": "",
                    "text": "asdsa",
                    "type": "text",
                    "version": 1
                  }
                ],
                "direction": "ltr",
                "format": "",
                "indent": 0,
                "type": "paragraph",
                "version": 1,
                "textFormat": 0,
                "textStyle": ""
              },
              {
                "children": [],
                "direction": "ltr",
                "format": "",
                "indent": 0,
                "type": "paragraph",
                "version": 1,
                "textFormat": 0,
                "textStyle": ""
              },
              {
                "format": "",
                "type": "block",
                "version": 2,
                "fields": {
                  "id": "674f7a14d9a0e8744c8657ab",
                  "blockName": "",
                  "arrayField": [
                    {
                      "id": "674f7a14d9a0e8744c8657ac",
                      "step": "1",
                      "stepcontent": {
                        "root": {
                          "children": [
                            {
                              "children": [
                                {
                                  "detail": 0,
                                  "format": 0,
                                  "mode": "normal",
                                  "style": "",
                                  "text": "dat weet ik nog niet",
                                  "type": "text",
                                  "version": 1
                                }
                              ],
                              "direction": "ltr",
                              "format": "",
                              "indent": 0,
                              "type": "paragraph",
                              "version": 1,
                              "textFormat": 0,
                              "textStyle": ""
                            }
                          ],
                          "direction": "ltr",
                          "format": "",
                          "indent": 0,
                          "type": "root",
                          "version": 1
                        }
                      }
                    },
                    {
                      "id": "674f7a49f116e8cfa2d6eb89",
                      "step": "2",
                      "stepcontent": {
                        "root": {
                          "children": [
                            {
                              "children": [
                                {
                                  "detail": 0,
                                  "format": 0,
                                  "mode": "normal",
                                  "style": "",
                                  "text": "dit is nog vaak",
                                  "type": "text",
                                  "version": 1
                                }
                              ],
                              "direction": "ltr",
                              "format": "",
                              "indent": 0,
                              "type": "paragraph",
                              "version": 1,
                              "textFormat": 0,
                              "textStyle": ""
                            }
                          ],
                          "direction": "ltr",
                          "format": "",
                          "indent": 0,
                          "type": "root",
                          "version": 1
                        }
                      }
                    }
                  ],
                  "blockType": "stepBlock"
                }
              }
            ],
            "direction": "ltr",
            "format": "",
            "indent": 0,
            "type": "root",
            "version": 1
          }
        }
      }

    console.log('Recipe data to be saved:', JSON.stringify(recipeData, null, 2))
    
    const test = await payload.create({
      collection: 'recipes',
      data: tempRecipeData
    })

    console.log('Recipe saved:', test)
    
  } catch (error) {
    console.error('Error adding recipe:', error)
    throw new Error('Failed to add recipe')
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
