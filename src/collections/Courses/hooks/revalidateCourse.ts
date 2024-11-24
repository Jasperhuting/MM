import type { CollectionAfterChangeHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Course } from '../../../payload-types'

export const revalidateCourse: CollectionAfterChangeHook<Course> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  if (doc._status === 'published') {
    const path = `/courses/${doc.slug}`

    payload.logger.info(`Revalidating course at path: ${path}`)

    revalidatePath(path)
  }

  // If the course was previously published, we need to revalidate the old path
  if (previousDoc._status === 'published' && doc._status !== 'published') {
    const oldPath = `/courses/${previousDoc.slug}`

    payload.logger.info(`Revalidating old course at path: ${oldPath}`)

    revalidatePath(oldPath)
  }

  return doc
}
