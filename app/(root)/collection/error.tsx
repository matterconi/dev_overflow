'use client'

import Image from 'next/image'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mt-16 flex w-full flex-col items-center justify-center sm:mt-36">
      <Image
        src="/images/dark-error.png"
        alt="Error illustration"
        width={270}
        height={200}
        className="hidden object-contain dark:block"
      />
      <Image
        src="/images/light-error.png"
        alt="Error illustration"
        width={270}
        height={200}
        className="block object-contain dark:hidden"
      />

      <h2 className="h2-bold text-dark200_light900 mt-8">Failed to load collection</h2>
      <p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">
        We couldn&apos;t fetch your saved questions. Please try again.
      </p>

      <Button
        onClick={reset}
        className="paragraph-medium mt-5 min-h-[46px] rounded-lg bg-primary-500 px-4 py-3 text-light-900 hover:bg-primary-500"
      >
        Try again
      </Button>
    </div>
  )
}
