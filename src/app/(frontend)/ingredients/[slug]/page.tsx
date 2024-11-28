import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'

import type { Ingredient, Recipe } from '@/payload-types'

import PageClient from './page.client'

type Args = {
  params: Promise<{
    slug: string
  }>
}


export default async function Page({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const url = `/ingredients/${slug}`

  const ingredient = await queryIngredientBySlug({ slug })

  if (!ingredient) {
    return <PayloadRedirects url={url} />
  }

  const { image } = ingredient

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      <div className="container">
        <div className="prose dark:prose-invert max-w-none">
        <h1>{ingredient.title}</h1>
          {image && (
            <Media
              className="mb-8"
              imgClassName="w-1/3 h-auto object-cover object-center"
              priority
              resource={image}
            />
          )}          
        </div>
      </div>
    </article>
  )
}

const queryIngredientBySlug = cache(async ({ slug }: { slug: string }) => {
  const draft = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const {
    docs: [doc],
  } = await payload.find({
    collection: 'ingredients',
    depth: 2,
    where: {
      AND: [
        {
          slug: {
            equals: slug,
          },
        },
        draft.isEnabled ? {} : { _status: { equals: 'published' } },
      ],
    },
  })

  return doc as Ingredient | null
})
