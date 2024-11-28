"use client"

import type { StaticImageData } from 'next/image'

import { cn } from 'src/utilities/cn'
import React, { useState } from 'react'
import RichText from '@/components/RichText'

import type { StepBlock as StepBlockProps } from '@/payload-types'


type Props = StepBlockProps & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  arrayField?: any
  enableGutter?: boolean
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}

export const StepBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    arrayField,
    staticImage,
    disableInnerContainer,
  } = props

  const [enabledSteps, setEnabledSteps] = useState<boolean[]>(
    arrayField.map(() => true)
  );

  const toggleStep = (index: number) => {
    const newEnabledSteps = [...enabledSteps];
    newEnabledSteps[index] = !newEnabledSteps[index];
    setEnabledSteps(newEnabledSteps);
  };

  console.log('props', arrayField);


  return (
    <div className="w-full">
      {arrayField.map((item, index) => {
        const { step, stepcontent } = item
        return (
          <div
            key={index}
            onClick={() => toggleStep(index)} 
            className={cn(
              'flex flex-row items-center gap-2',
              className,
            )}
          >
            <span               
              className={cn(
                'rounded-full w-10 h-10 flex items-center justify-center border cursor-pointer transition-colors',
                enabledSteps[index] 
                  ? 'border-primary text-primary' 
                  : 'border-gray-300 text-gray-300'
              )}
            >
              {step}
            </span>
            <RichText 
              className={cn(
                '',
                !enabledSteps[index] && 'opacity-50'
              )} 
              content={stepcontent} 
              enableGutter={true} 
            />

          </div>)
      })}</div>
  )
}
