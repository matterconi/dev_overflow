import ROUTES from '@/constants/routes'
import Link from 'next/link'
import React from 'react'

import { Badge } from '@/components/ui/badge'
import { getDeviconClassNames } from '@/lib/utils'

interface TagProps {
  _id: string
  name: string
  questions: number
  showCount?: boolean
  compact?: boolean
}

const TagCard = ({ _id, name, questions, showCount = true, compact }: TagProps) => {
    const iconClass = getDeviconClassNames(name);
  return (
    <Link href={ROUTES.TAGS(_id)} className="flex justify-between gap-2">
        <Badge className="subtle-medium background-light800_dark300 text-light400_dark500 rounded-md border-none px-4 py-2 uppercase">
            <div className='flex-center space-x-2'>
                <i className={`${iconClass} text-sm`}></i>
                <span className='text-dark500_light700'>{name}</span>
            </div>
        </Badge>

        {showCount && (
            <p className='small-medium text-dark500_light700'>{questions}</p>
        )}
    </Link>

  )
}

export default TagCard