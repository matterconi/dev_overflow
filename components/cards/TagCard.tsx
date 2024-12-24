import ROUTES from '@/constants/routes'
import Link from 'next/link'
import React from 'react'

import { Badge } from '@/components/ui/badge'
import { getDeviconClassNames } from '@/lib/utils'
import Image from 'next/image'

interface TagProps {
  _id: string
  name: string
  questions?: number
  showCount?: boolean
  compact?: boolean
  remove: boolean
  isButton?: boolean
  handleRemove?: () => void
}


const TagCard = ({ _id, name, questions, showCount = true, compact, remove, isButton, handleRemove }: TagProps) => {
    const iconClass = getDeviconClassNames(name);
    const Content = (
      <>
        <Badge className="subtle-medium background-light800_dark300 text-light400_dark500 rounded-md border-none px-4 py-2 uppercase flex flex-row gap-2">
          <div className='flex-center space-x-2'>
              <i className={`${iconClass} text-sm`}></i>
              <span className='text-dark500_light700'>{name}</span>
          </div>
          {remove && (
            <div onClick={handleRemove}>
              <Image src='/icons/close.svg' alt='close' width={12} height={12} className='cursor-pointer object-contain invert-0 dark:invert'/>
            </div>
          )}
        </Badge>
        {showCount && (
          <p className='small-medium text-dark500_light700'>{questions}</p>
        )}
      </>
    )
    if (compact) {
      return isButton ? (
        <button className='flex justify-between gap-2'>
          {Content}
        </button>
      ) : <Link href={ROUTES.TAGS(_id)} className="flex justify-between gap-2">
      {Content}
  </Link>
    }
}

export default TagCard