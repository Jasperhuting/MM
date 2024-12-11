import type { CollectionConfig, Field } from 'payload'

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
import { populateAuthors } from './hooks/populateAuthors'
import { revalidateRecipe } from './hooks/revalidateRecipe'
import { addCurrentUserAsAuthor } from '../../hooks/addCurrentUserAsAuthor'
import { slugField } from '@/fields/slug'
import { getServerSideURL } from '@/utilities/getURL'
import { StepBlock } from '@/blocks/StepBlock/config'
import {
  AuthorsField,
  AverageRatingField,
  CategoriesField,
  CookingInstructionsField,
  CookingInstructionsRawField,
  ImageField,
  IngredientsField,
  PopulateAuthorsField,
  PreparationTimeField,
  PublishedAtField,
  TitleField,
  TotalRatingsField,
} from '@/collections/fields'
import { Categories } from '../Categories'

export const Recipes: CollectionConfig = {
  slug: 'recipes',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    categories: true,
    image: true,
  },
  admin: {
    group: 'Recepten',
    defaultColumns: ['title', 'slug', 'category', 'updatedAt'],
    livePreview: {
      url: ({ data }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'recipes',
        })

        return `${getServerSideURL()}${path}`
      },
    },
    preview: (data) => {
      const path = generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'recipes',
      })

      return `${getServerSideURL()}${path}`
    },
    useAsTitle: 'title',
  },
  fields: [
    TitleField,
    ...slugField(),
    {
      type: 'row',
      admin: {
        position: 'sidebar',
      },
      fields: [AverageRatingField, TotalRatingsField],
    },
    IngredientsField,
    {
      type: 'row',
      fields: [PreparationTimeField, CategoriesField],
    },
    ImageField,
    CookingInstructionsRawField,
    CookingInstructionsField,
    PublishedAtField,
    AuthorsField,
    PopulateAuthorsField,
  ],
  hooks: {
    beforeChange: [addCurrentUserAsAuthor],
    afterChange: [
      revalidateRecipe,
      async ({ doc, operation, req: { payload } }) => {
        // After a recipe is created or updated, update the ingredients' recipes field
        if (operation === 'create' || operation === 'update') {
          const ingredients = doc.ingredients || []

          // For each ingredient in the recipe
          for (const ingredientId of ingredients) {
            // Get the current ingredient
            const ingredient = await payload.findByID({
              collection: 'ingredients',
              id: ingredientId,
            })

            // Get current recipes list and ensure it's an array
            const currentRecipes = ingredient?.recipes || []

            // Only update if this recipe isn't already in the ingredient's recipes list
            if (!currentRecipes.some(recipeId => recipeId === doc.id)) {
              await payload.update({
                collection: 'ingredients',
                id: ingredientId,
                data: {
                  recipes: [...currentRecipes, doc.id],
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
