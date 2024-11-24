import type { CollectionBeforeChangeHook } from 'payload'
import { User } from 'src/payload-types'

export const addCurrentUserAsAuthor: CollectionBeforeChangeHook = async ({
  data, // the new data being sent
  req, // full express request
  operation, // either 'create' or 'update'
}) => {
  // Only proceed if we have a logged-in user
  if (req.user) {
    // Initialize authors array if it doesn't exist
    if (!data.authors) {
      data.authors = []
    }

    // Convert authors to array if it's not already
    const authors = Array.isArray(data.authors) ? data.authors : [data.authors].filter(Boolean)
    
    // Add current user ID if not already in authors array
    const currentUserId = req.user.id
    const authorIds = authors.map(author => 
      typeof author === 'object' ? author.id : author
    )
    
    if (!authorIds.includes(currentUserId)) {
      authors.push(currentUserId)
      data.authors = authors
    }
  }

  return data
}
