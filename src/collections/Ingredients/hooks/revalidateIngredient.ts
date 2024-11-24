import type { CollectionAfterChangeHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Ingredient } from '../../../payload-types'

export const revalidateIngredient: CollectionAfterChangeHook<Ingredient> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  if (doc._status === 'published') {
    const path = `/ingredients/${doc.slug}`

    payload.logger.info(`Revalidating recipe at path: ${path}`)

    revalidatePath(path)
  }

  // If the ingredient was previously published, we need to revalidate the old path
  if (previousDoc._status === 'published' && doc._status !== 'published') {
    const oldPath = `/ingredients/${previousDoc.slug}`

    payload.logger.info(`Revalidating old ingredient at path: ${oldPath}`)

    revalidatePath(oldPath)
  }

  return doc
}
