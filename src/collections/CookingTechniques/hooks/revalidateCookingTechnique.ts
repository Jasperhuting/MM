import type { CollectionAfterChangeHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Course } from '../../../payload-types'

export const revalidateCookingTechnique: CollectionAfterChangeHook<Course> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  if (doc._status === 'published') {
    const path = `/cookingTechniques/${doc.slug}`

    payload.logger.info(`Revalidating cookingTechnique at path: ${path}`)

    revalidatePath(path)
  }

  // If the course was previously published, we need to revalidate the old path
  if (previousDoc._status === 'published' && doc._status !== 'published') {
    const oldPath = `/cookingTechniques/${previousDoc.slug}`

    payload.logger.info(`Revalidating old cookingTechnique at path: ${oldPath}`)

    revalidatePath(oldPath)
  }

  return doc
}
