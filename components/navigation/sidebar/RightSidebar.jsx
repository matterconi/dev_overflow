import ROUTES from '@/constants/routes';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import TagCard from '@/components/cards/TagCard';

const hotQuestions = [
    {
        _id: 1,
        title: 'How to create a custom hook in React?',
        votes: 10,
        answers: 5,
        views: 100
    },
    {
        _id: 2,
        title: 'How to use React Router?',
        votes: 7,
        answers: 3,
        views: 50
    },
    {
        _id: 3,
        title: 'How to use Redux in React?',
        votes: 5,
        answers: 2,
        views: 30
    },
    {
        _id: 4,
        title: 'How to use Context API in React?',
        votes: 3,
        answers: 1,
        views: 20
    },
    {
        _id: 5,
        title: 'How to use React Query?',
        votes: 2,
        answers: 1,
        views: 10
    }
]

const popularTags = [
    {_id: 1, name: 'React', questions: 1000},
    {_id: 2, name: 'JavaScript', questions: 900},
    {_id: 3, name: 'TypeScript', questions: 800},
    {_id: 4, name: 'Node.js', questions: 700},
    {_id: 5, name: 'Express.js', questions: 600},
]

function RightSidebar() {
  return (
    <section className='pt-36 custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l p-6 shadow-light-300 dark:shadow-none max-xl:hidden'>
        <div>
            <h3 className='h3-bold text-dark_200_light_900'>Top Questions</h3>

            <div className='mt-7 flex w-full flex-col gap-[30px]'>
                {hotQuestions.map((question) => (
                   <Link key={question._id} href={ROUTES.PROFILE(question._id)} className='flex cursor-pointer items-center justify-between gap-7'>
                        <p className='body-medium text-dark500_light700'>
                            {question.title}
                        </p>

                        <Image src='/icons/chevron-right.svg' width={20} height={20} alt='chevron-right' className='invert-colors'/>
                    </Link>
                ))}
            </div>
        </div>

        <div className='mt-16'>
                <h3 className='h3-bold text-dark200_light900'>Popular Tags</h3>

                <div className='mt-7 flex flex-col gap-4'>
                {popularTags.map(({ _id, name, questions }) => (
                    <TagCard key={_id} _id={_id} name={name} questions={questions}/>
                ))}
                </div>
        </div>
    </section>
  )
}

export default RightSidebar