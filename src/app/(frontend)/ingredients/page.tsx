import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { RecipeFilters } from './RecipeFilters'
import PageClient from './page.client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Ingredients({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const payload = await getPayload({ config: configPromise })

  const recipes = await payload.find({
    collection: 'recipes',
    depth: 1,
    limit: 100,
    overrideAccess: false,
  })

  const selectedRecipes = searchParams.recipes 
    ? (typeof searchParams.recipes === 'string' 
      ? searchParams.recipes.split(',') 
      : searchParams.recipes)
    : []

  console.log('Selected recipes:', selectedRecipes)

  const ingredients = await payload.find({
    collection: 'ingredients',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    where: selectedRecipes.length > 0 ? {
      recipes: {
        in: selectedRecipes,
      },
    } : undefined,
  })

  console.log('Filtered ingredients:', ingredients.docs.length)

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Ingredients</h1>
        </div>
      </div>

      <div className="container grid grid-cols-12 gap-8">
        <RecipeFilters recipes={recipes.docs} />

        <div className="col-span-9">
          <div className="container mb-8">
            <PageRange
              collection="ingredients"
              currentPage={ingredients.page}
              limit={12}
              totalDocs={ingredients.totalDocs}
            />
          </div>

          <CollectionArchive posts={ingredients.docs} relationTo="ingredients" />

          <div className="container">
            {ingredients.totalPages > 1 && ingredients.page && (
              <Pagination page={ingredients.page} totalPages={ingredients.totalPages} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template ingredients`,
  }
}
