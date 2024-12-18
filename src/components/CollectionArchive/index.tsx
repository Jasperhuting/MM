import { cn } from 'src/utilities/cn'
import React from 'react'

import type { Ingredient, Recipe } from '@/payload-types'

import { Card } from '@/components/Card'

export type Props = {
  posts: Recipe[] | Ingredient[];
  relationTo: 'recipes' | 'ingredients';
}

export const CollectionArchive: React.FC<Props> = (props) => {

  const { posts, relationTo } = props


  return (
    <div className={cn('container')}>
      <div>
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
          {posts?.map((result, index) => {

            console.log('result', result)

            if (typeof result === 'object' && result !== null) {
              return (
                <div className="col-span-4" key={index}>
                  {relationTo && <Card className="h-full" doc={result} relationTo={relationTo} showCategories />}
                </div>
              )
            }

            return null
          })}
        </div>
      </div>
    </div>
  )
}
