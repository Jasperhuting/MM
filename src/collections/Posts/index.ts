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
import { revalidatePost } from './hooks/revalidatePost'
import { addCurrentUserAsAuthor } from '../../hooks/addCurrentUserAsAuthor'
import { slugField } from '@/fields/slug'
import { getServerSideURL } from '@/utilities/getURL'
import { AuthorsField, CategoriesField, PublishedAtField, TitleField } from '../fields'

export const Posts: CollectionConfig = {
  slug: 'posts',
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
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'posts',
        })

        return `${getServerSideURL()}${path}`
      },
    },
    preview: (data) => {
      const path = generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'posts',
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
    TitleField,
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'content',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    BlocksFeature({
                      blocks: [Banner, Code, MediaBlock],
                    }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: false,
              required: true,
            },
          ],
        },
        {
          label: 'Related',
          fields: [
            {
              name: 'relatedPosts',
              type: 'relationship',
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_equals: id,
                  },
                }
              },
              hasMany: true,
              relationTo: 'posts',
            },
            CategoriesField,
            AuthorsField,
            PublishedAtField,
            {
              name: 'populatedAuthors',
              type: 'array',
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
              admin: {
                readOnly: true,
              },
            },
            ...slugField(),
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [addCurrentUserAsAuthor],
    afterChange: [revalidatePost],
    afterRead: [populateAuthors],
  },
}
