'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const PageClient: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setHeaderTheme } = useHeaderTheme()

  /* Force the header to be dark mode while we have an image behind it */
  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  const handleIngredientFilter = (selectedIngredients: string[]) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (selectedIngredients.length > 0) {
      params.set('ingredients', selectedIngredients.join(','))
    } else {
      params.delete('ingredients')
    }

    router.push(`?${params.toString()}`)
  }

  return <React.Fragment />
}

export default PageClient
