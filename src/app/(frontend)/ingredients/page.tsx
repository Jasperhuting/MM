import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Ingredients() {
  const payload = await getPayload({ config: configPromise })

  const ingredients = await payload.find({
    collection: 'ingredients',
    depth: 1,
    limit: 12,
    overrideAccess: false,
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>ingredient</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="ingredient"
          currentPage={ingredients.page}
          limit={12}
          totalDocs={ingredients.totalDocs}
        />
      </div>

      <CollectionArchive posts={ingredients.docs}/>

      <div className="container">
        {ingredients.totalPages > 1 && ingredients.page && (
          <Pagination page={ingredients.page} totalPages={ingredients.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template ingredients`,
  }
}
