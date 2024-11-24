import { BeforeSync, DocToSync } from '@payloadcms/plugin-search/types'

export const beforeSyncWithSearch: BeforeSync = async ({ originalDoc, searchDoc, payload }) => {
  const {
    doc: { relationTo: collection },
  } = searchDoc

  console.log('searchDoc', searchDoc)

  
  const { slug, id, categories, title, image } = originalDoc
  console.log('originalDoc', originalDoc)

  const modifiedDoc: DocToSync = {
    ...searchDoc,
    slug,
    image,
    title,
    categories: [],
  }

  if (categories && Array.isArray(categories) && categories.length > 0) {
    // get full categories and keep a flattened copy of their most important properties
    try {
      const mappedCategories = categories.map((category) => {
        const { id, title } = category

        return {
          relationTo: 'categories',
          id,
          title,
        }
      })

      modifiedDoc.categories = mappedCategories
    } catch (err) {
      console.error(
        `Failed. Category not found when syncing collection '${collection}' with id: '${id}' to search.`,
      )
    }
  }

  return modifiedDoc
}
