import { Field } from "payload";

export const TitleField: Field = {
    name: 'title',
    type: 'text',
    required: true,
    unique: true,
  }

  export const IngredientsField: Field = {
    name: 'ingredients',
    type: 'relationship',
    relationTo: 'ingredients',
    hasMany: true,
    required: false,
  }

  export const PreparationTimeField: Field = {
    name: 'preparationTime',
    type: 'number',
    required: false,
  }

  export const ImageField: Field = {
    name: 'image',
    type: 'upload',
    relationTo: 'media',
    required: false,
  }

  export const CookingInstructionsRawField: Field = {
    name: 'cookingInstructionsRaw',
    type: 'text',
    label: "Cooking Instructions (raw)",
    required: false,
  }

  export const CookingInstructionsField: Field =  {
    name: 'cookingInstructions',
    type: 'array',
    fields:[
      {
        name: 'step',
        type: "richText"
      }
    ],
    label: "Cooking Instructions",
    required: false,
  }

  export const PublishedAtField: Field = {
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
  }

  export const AuthorsField: Field = {
    name: 'authors',
    type: 'relationship',
    admin: {
      position: 'sidebar',
    },
    hasMany: true,
    relationTo: 'users',
  }

  export const PopulateAuthorsField: Field = {
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
  }

  export const CategoriesField: Field = {
    name: 'categories',
    type: 'relationship',
    admin: {
      position: 'sidebar',
    },
    hasMany: true,
    relationTo: 'categories',
  }

  export const AverageRatingField: Field = {
    name: 'averageRating',
    type: 'number',
    required: false,
    admin: {
      description: 'Automatically calculated average rating for this recipe',
      readOnly: true,
    },
  }
  export const TotalRatingsField: Field = {
    name: 'totalRatings',
    type: 'number',
    required: false,
    admin: {
      description: 'Total number of ratings for this recipe',
      readOnly: true,
    },
  }

  export const IngredientsAmountField: Field = {
    name: 'ingredientsAmount',
    type: 'number',
    required: true,
  }

  export const RecipesField: Field = {
    name: 'recipes',
    type: 'relationship',
    relationTo: 'recipes',
    hasMany: true,
    required: false,
  }

  export const MeasurementsField: Field = {
    name: 'measurements',
    type: 'select',
    options: [
      {
        label: 'Gram',
        value: 'grams',
      },
      {
        label: 'KiloGram',
        value: 'kilograms',
      },
      {
        label: 'Liter',
        value: 'liters',
      },
      {
        label: 'Milliliter',
        value: 'milliliters',
      },
      {
        label: 'Aantal',
        value: 'amount',
      },
      {
        label: 'Theelepel',
        value: 'teaspoons',
      },
      {
        label: 'Eetlepel',
        value: 'tablespoons',
      },
    ],
    required: false,
  }

  export const UsersField: Field = {
    name: 'user',
    type: 'relationship',
    relationTo: 'users',
    required: true,
    admin: {
      readOnly: false,
    },
  }