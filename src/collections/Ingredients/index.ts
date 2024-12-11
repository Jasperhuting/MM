import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateIngredient } from '../Ingredients/hooks/revalidateIngredient'

import { slugField } from '@/fields/slug'
import { getServerSideURL } from '@/utilities/getURL'
import { addCurrentUserAsAuthor } from '@/hooks/addCurrentUserAsAuthor'
import { AuthorsField, CategoriesField, ImageField, IngredientsAmountField, MeasurementsField, PopulateAuthorsField, PublishedAtField, RecipesField, TitleField } from '../fields'

export const Ingredients: CollectionConfig = {
  slug: 'ingredients',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a ingredient is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  defaultPopulate: {
    title: true,
    slug: true,
    categories: true,
    image: true,
  },
  admin: {
    group: 'Recepten',
    defaultColumns: ['title', 'category', 'slug', 'image', 'updatedAt'],
    livePreview: {
      url: ({ data }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'ingredients',
        })

        return `${getServerSideURL()}${path}`
      },
    },
    preview: (data) => {
      const path = generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'ingredients',
      })

      return `${getServerSideURL()}${path}`
    },
    useAsTitle: 'title',
  },
  fields: [
    TitleField,
    ...slugField(),
    ImageField,
    IngredientsAmountField,    
    MeasurementsField,
    RecipesField,
    CategoriesField,
    PublishedAtField,
    AuthorsField,
    PopulateAuthorsField,
  ],
  hooks: {
    beforeChange: [addCurrentUserAsAuthor],
    afterChange: [
      revalidateIngredient,
      async ({ doc, operation, req: { payload } }) => {
        // After an ingredient is created or updated, update the recipes' ingredients field
        if (operation === 'create' || operation === 'update') {
          const recipes = doc.recipes || []

          // For each recipe that uses this ingredient
          for (const recipeId of recipes) {
            // Get the current recipe
            const recipe = await payload.findByID({
              collection: 'recipes',
              id: recipeId,
            })

            // Get current ingredients list and ensure it's an array
            const currentIngredients = recipe?.ingredients || []

            // Only update if this ingredient isn't already in the recipe's ingredients list
            if (!currentIngredients.some(ingredientId => ingredientId === doc.id)) {
              await payload.update({
                collection: 'recipes',
                id: recipeId,
                data: {
                  ingredients: [...currentIngredients, doc.id],
                },
              })
            }
          }
        }
      },
    ],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
    },
    maxPerDoc: 50,
  },
}
