import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: Request) {
  const openai = new OpenAI({
    apiKey: process.env.CHAT_GPT_KEY,
  })

  try {
    const body = await request.json()
    const { recipeUrls } = body

    console.log('Recipe URLs:', recipeUrls)

    // Generate completion using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `ik wil graag vanuit deze link het recept hebben en dit wil ik graag opdelen in delen. 
zo moet er een ingredientenlijst komen, een stappenplan hoe je het maakt. of het een voorgerecht, hoofdgerecht ofzoiets is en hoelang je ermee bezig gaat zijn. ik wil de bereidingswijze terugkrijgen in stappen in een array dus: ['verwarm de oven voor op 200 graden.", "...","..."]. De porties mag weg. totale_tijd moet "preparationTime" heten. ingredientent ziet er als volgt uit: 
[{
title: string,
ingredientsAmount: number,
measurements: [grams, kilograms, liters, mililiters, amount, teaspoons, tablespoons]
}]

Graag wil ik dit terug hebben als 2 json objecten.

1 met alle ingredienten en 1 met de rest

please use this: 

{
  "slug": "testingredient",
  "title": "jasperingredient",
  "measurements": "amount",
  "ingredientsAmount": 2
}`,
        },
        {
          role: 'user',
          content: `${recipeUrls}`,
        },
      ],
    })

    const generatedText = completion?.choices[0].message.content || ''
    console.log('Generated text:', generatedText)

    return NextResponse.json({ generatedText })
  } catch (error: unknown) {
    console.error('Error:', error)
    if (error instanceof Error && 'response' in error) {
      const apiError = error as { response: { data: unknown; status: number; headers: unknown } }
      return NextResponse.json({ error: 'OpenAI API error', details: apiError.response.data }, { status: 500 })
    } else if (error instanceof Error) {
      return NextResponse.json({ error: 'Error occurred', details: error.message }, { status: 500 })
    } else {
      return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 })
    }
  }
}
