import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { populateAuthors } from '../Courses/hooks/populateAuthors'
import { revalidateCourse } from '../Courses/hooks/revalidateCourse'
import { addCurrentUserAsAuthor } from '../../hooks/addCurrentUserAsAuthor'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from '@/fields/slug'
import { getServerSideURL } from '@/utilities/getURL'
import { AuthorsField, CategoriesField, PopulateAuthorsField, PublishedAtField, TitleField } from '../fields'

export const Courses: CollectionConfig = {
  slug: 'courses',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a recipe is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  defaultPopulate: {
    title: true,
    slug: true,
    categories: true,
  },
  admin: {
    group: 'Recepten',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'courses',
        })

        return `${getServerSideURL()}${path}`
      },
    },
    preview: (data) => {
      const path = generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'courses',
      })

      return `${getServerSideURL()}${path}`
    },
    useAsTitle: 'title',
  },
  fields: [
    TitleField,
    CategoriesField,    
    PublishedAtField,
    AuthorsField,
    PopulateAuthorsField,
    ...slugField(),
  ],
  hooks: {
    beforeChange: [addCurrentUserAsAuthor],
    afterChange: [revalidateCourse],
    afterRead: [populateAuthors],
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
