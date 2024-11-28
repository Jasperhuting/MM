import { FixedToolbarFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const StepBlock: Block = {
  slug: 'stepBlock',
  interfaceName: 'StepBlock',
  fields: [
    {
      name: "arrayField",
      type: "array",
      fields: [
        {
          name: 'step',
          type: 'text',
          required: true,
        },
        {
          name: 'stepcontent',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
            },
          }),
          required: true,
        },
      ],
    },
    
  ],
}
