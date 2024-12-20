import { Button } from '@/components/ui/button'
import ROUTES from '@/constants/routes'
import Link from 'next/link'
import React from 'react'

import LocalSearch from '@/components/search/LocalSearch'
import HomeFilter from '@/components/filters/HomeFilter'
import { auth } from '@/auth'
import QuestionCard from '@/components/cards/QuestionCard'

const questions = [
  {
    _id: '1',
    title: 'How to use React?',
    description: 'I am new to React and I want to learn how to use it. Can someone help me?',
    tags: [{
      _id: '1',
      name: 'React'
    }, {
      _id: '2',
      name: 'JavaScript'
    }],
    author: {
      _id: '1',
      name: 'John Doe',
      imgUrl: 'https://randomuser.me/api/portraits/women/24.jpg'
    },
    upvotes: 10,
    answers: 5,
    views: 20,
    createdAt: Date.now()
  },
  {
    _id: '2',
    title: 'How to use Next.js?',
    description: 'I am new to Next.js and I want to learn how to use it. Can someone help me?',
    tags: [{
      _id: '1',
      name: 'Next.js'
    }, {
      _id: '2',
      name: 'React'
    }],
    author: {
      _id: '2',
      name: 'Jane Doe',
      imgUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    upvotes: 15,
    answers: 7,
    views: 25,
    createdAt: '2021-09-02T00:00:00.000Z'
  }
]

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>
}

const page = async ({ searchParams }: SearchParams ) => {
  const { query = "", filter = ""} = await searchParams;

  const filteredQuestions = questions.filter((question) => {
    const matchesQuery = question.title.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter ? question.tags.some(tag => tag.name.toLowerCase().includes(filter.toLowerCase())) : false;
    return matchesQuery && matchesFilter;
  });

  return (
    <>
      <section className='w-full flex flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
        <h1 className='h1-bold text-dark100_light900'>All questions</h1>

        <Button className='primary-gradient min-h-[46px] px-4 py-3 !text-light-900' asChild>
          <Link href={ROUTES.ASK_QUESTION}>
            Ask a question
          </Link>
        </Button>
      </section>

      <section className='mt-11'>
        <LocalSearch route="/" imgSrc="/icons/search.svg" placeholder="Search questions..." otherClasses="flex-1"/>
      </section>

      <HomeFilter />

      <div className='mt-10 flex w-full flex-col gap-6'>
       {filteredQuestions.map((question) => (
        <QuestionCard key={question._id} question={question} />
       ))}
      </div>
    </>
  )
}

export default page