import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import PageClient from './[slug]/page.client'

export default async function HomePage() {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const {
    docs: [page],
  } = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'home',
      },
    },
    draft: draft,
    depth: 2,
  })

  if (!page) {
    return <PayloadRedirects url="/" />
  }

  return (
    <article>
      <PageClient />
      <PayloadRedirects disableNotFound url="/" />

      {page.hero && <RenderHero {...page.hero} />}
      {page.layout && <RenderBlocks blocks={page.layout} />}
    </article>
  )
}
