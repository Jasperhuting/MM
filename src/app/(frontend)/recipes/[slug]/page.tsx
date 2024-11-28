import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'

import type { Recipe } from '@/payload-types'

import PageClient from './page.client'
import { IngredientsList } from '@/components/IngredientsList'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export const metadata: Metadata = {
  title: 'Recipes',
  description: 'Browse our collection of recipes'
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const url = `/recipes/${slug}`

  const recipe = await queryRecipeBySlug({ slug })

  if (!recipe) {
    return <PayloadRedirects url={url} />
  }

  const { image, preparationTime, cookingInstructions, ingredients } = recipe

  return (
    <article className="pb-24">
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      <div className="container">
        <div className="prose dark:prose-invert max-w-none">
          {image && (
            <Media
              className="mb-8"
              imgClassName="w-full h-auto max-h-[20rem] object-cover object-center"
              priority
              resource={image}
            />
          )}
          <h1>{recipe.title}</h1>
          <p>Bereiding: {preparationTime} min</p>
          <div className="flex flex-row gap-8">
          {ingredients && ingredients.length > 0 && <IngredientsList ingredients={ingredients} />}
          {cookingInstructions && <RichText className="w-full" content={cookingInstructions} enableGutter={true} />}
          </div>
        </div>
      </div>
    </article>
  )
}

const queryRecipeBySlug = cache(async ({ slug }: { slug: string }) => {
  const draft = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const {
    docs: [doc],
  } = await payload.find({
    collection: 'recipes',
    depth: 2,
    where: {
      slug: {
        equals: slug,
      },
    },
    draft: draft.isEnabled,
  })

  return doc as Recipe | null
})
