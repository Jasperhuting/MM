
import { CollectionConfig } from 'payload';
import { authenticated } from '../../access/authenticated';
import { addCurrentUserAsAuthor } from '@/hooks/addCurrentUserAsAuthor';
import { UsersField } from '../fields';

export const Ratings: CollectionConfig = {
  slug: 'ratings',
  admin: {
    useAsTitle: 'rating',
    group: 'Content',
  },
  access: {
    create: authenticated,
    read: ({ req: { user } }) => {
      if (user) {
        return true;
      }
      return {
        _status: {
          equals: 'published',
        },
      };
    },
    update: ({ req: { user } }) => {
      console.log('user', user);

      // if (user?.role === 'admin') return true;

      return {
        user: {
          equals: user?.id,
        },
      };
    },
    delete: ({ req: { user } }) => {
      // if (user?.role === 'admin') return true;

      return {
        user: {
          equals: user?.id,
        },
      };
    },
  },
  fields: [
    {
      name: 'recipe',
      type: 'relationship',
      relationTo: 'recipes',
      required: true,
      validate: async (val, options) => {
        const { user, payload } = options?.req;

        if (!val) return 'Please select a recipe to rate';
        if (!user) return 'You must be logged in to rate a recipe';
      
        // Check if user has already rated this recipe
        const query = {
          and: [
            {
              recipe: { equals: val }
            },
            {
              user: { equals: user?.id }
            }
          ]
        };
        const existingRating = await payload?.find({
          collection: 'ratings',
          where: query,
        });
        if (existingRating?.totalDocs > 0) {
          return 'You have already rated this recipe';
        }
      
        return true;
      },
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      admin: {
        description: 'Rate from 1 to 5 stars',
      },
    },
    {
      name: 'comment',
      type: 'textarea',
      admin: {
        description: 'Optional comment about your rating',
      },
    },
    UsersField,
  ],
  hooks: {
    beforeChange: [addCurrentUserAsAuthor, 
      async ({
        data,
        req,
        operation,
      }) => {        
        if (operation === 'create') {
          data.user = req?.user?.id;
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc, operation, req: { payload }, }) => {
        // After a rating is created or updated, calculate and update the average rating
        if (operation === 'create' || operation === 'update') {
          const recipeId = doc.recipe;
          
          // Get all ratings for this recipe
          const ratings = await payload.find({
            collection: 'ratings',
            where: {
              recipe: {
                equals: recipeId,
              },
            },
          });

          // Calculate average rating
          const totalRating = ratings.docs.reduce((sum, rating) => sum + rating.rating, 0);
          const averageRating = totalRating / ratings.totalDocs;

          // Update recipe with new average rating
          await payload.update({
            collection: 'recipes',
            id: recipeId,
            data: {
              averageRating: averageRating,
              totalRatings: ratings.totalDocs,
            },
          });
        }
      },
    ],
  },
};
