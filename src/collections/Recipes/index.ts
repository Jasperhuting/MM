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
import { populateAuthors } from './hooks/populateAuthors'
import { revalidateRecipe } from './hooks/revalidateRecipe'
import { addCurrentUserAsAuthor } from '../../hooks/addCurrentUserAsAuthor'
import { slugField } from '@/fields/slug'
import { getServerSideURL } from '@/utilities/getURL'
import { StepBlock } from '@/blocks/StepBlock/config'

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
    {
      name: '_status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'row',
      fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    ...slugField(),
      ]},
      {
        type: 'row',
        admin: {
          position: 'sidebar',
        },
        fields: [
    {
      name: 'averageRating',
      type: 'number',
      required: false,
      admin: {
        description: 'Automatically calculated average rating for this recipe',
        readOnly: true,
      },
    },
    {
      name: 'totalRatings',
      type: 'number',
      required: false,
      admin: {
        description: 'Total number of ratings for this recipe',
        readOnly: true,
      },
    },]},
    {
      name: 'ingredients',
      type: 'relationship',
      relationTo: 'ingredients',
      hasMany: true,
      required: true,
    },
    {
      name: 'relatedIngredients',
      type: 'relationship',
      relationTo: 'ingredients',
      hasMany: true,
      label: 'Related Ingredients',
      admin: {
        position: 'sidebar',
      }
    },
    {
    type: 'row',
    fields: [
      {
        name: 'preparationTime',
        type: 'text',
        required: false,
      },
      {
        name: 'categories',
        type: 'relationship',
        admin: {
          position: 'sidebar',
        },
        hasMany: true,
        relationTo: 'categories',
      },
    ],
    },
    
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'cookingInstructions',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            BlocksFeature({
              blocks: [Banner, Code, MediaBlock, StepBlock],
            }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
          ]
        },
      }),
      label: "Cooking Instructions",
      required: false,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'authors',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'users',
    },
    {
      name: 'populatedAuthors',
      type: 'array',
      access: {
        update: () => false,
      },
      admin: {
        disabled: true,
        readOnly: true,
      },
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [addCurrentUserAsAuthor],
    afterChange: [
      revalidateRecipe,
      async ({ doc, operation, req: { payload } }) => {
        // After a recipe is created or updated, update the ingredients' recipes field
        if (operation === 'create' || operation === 'update') {
          const ingredients = doc.ingredients || [];
          
          // For each ingredient in the recipe
          for (const ingredientId of ingredients) {
            // Get the current ingredient
            const ingredient = await payload.findByID({
              collection: 'ingredients',
              id: ingredientId,
            });

            // Get current recipes list
            const currentRecipes = ingredient.recipes || [];

            // Add this recipe if it's not already in the list
            if (!currentRecipes.includes(doc.id)) {
              await payload.update({
                collection: 'ingredients',
                id: ingredientId,
                data: {
                  recipes: [...currentRecipes, doc.id],
                },
              });
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
