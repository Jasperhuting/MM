import type { Metadata } from 'next/types'

import { Card } from '@/components/Card'
import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { RecipeFilters } from './RecipeFilters'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Recipes({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const payload = await getPayload({ config: configPromise })
  
  const ingredients = await payload.find({
    collection: 'ingredients',
    depth: 1,
    limit: 100,
    overrideAccess: false,
  })

  const selectedIngredients = searchParams.ingredients 
    ? (typeof searchParams.ingredients === 'string' 
      ? searchParams.ingredients.split(',') 
      : searchParams.ingredients)
    : []

  console.log('Selected ingredients:', selectedIngredients)

  const recipes = await payload.find({
    collection: 'recipes',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    where: selectedIngredients.length > 0 ? {
      ingredients: {
        in: selectedIngredients,
      },
    } : undefined,
  })

  console.log('Filtered recipes:', recipes.docs.length)

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Recipes</h1>
        </div>
      </div>

      <div className="container grid grid-cols-12 gap-8">
        <RecipeFilters ingredients={ingredients.docs} />

        <div className="col-span-9">
          <div className="container mb-8">
            <PageRange
              collection="recipes"
              currentPage={recipes.page}
              limit={12}
              totalDocs={recipes.totalDocs}
            />
          </div>

          <CollectionArchive posts={recipes.docs} relationTo="recipes" />

          <div className="container">
            {recipes.totalPages > 1 && recipes.page && (
              <Pagination page={recipes.page} totalPages={recipes.totalPages} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template recipes`,
  }
}
