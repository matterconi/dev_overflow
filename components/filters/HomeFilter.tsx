'use client';

import React from 'react';
import { Button } from '../ui/button';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { cn } from '@/lib/utils';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/url';

const filters = [
  { name: "React", value: "newest" },
  { name: "Next", value: "popular" },
  { name: "Unanswered", value: "unanswered" },
  { name: "Trending", value: "trending" },
];

const HomeFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const filterParams = params?.filter || ''; // Safely access the filter parameter
  const [activeFilter, setActiveFilter] = React.useState(filterParams || '');

  const handleTypeClick = (filter: string) => {
    let newUrl = '';
    if(filter) {
      if (filter === activeFilter) {
        setActiveFilter('')
      newUrl = removeKeysFromQuery({ params: searchParams.toString(), keysToRemove: ['filter'],})
      } else {
        setActiveFilter(filter);
        newUrl = formUrlQuery({ params: searchParams.toString(), key: 'filter', value: filter.toLowerCase()});
      }
    } else {
      setActiveFilter('')
      newUrl = removeKeysFromQuery({ params: searchParams.toString(), keysToRemove: ['filter'],})
    }
    router.push(newUrl, { scroll: false });
  }

  return (
    <div className="mt-10 hidden flex-wrap gap-3 sm:flex">
      {filters.map((filterItem) => (
        <Button
          key={filterItem.name}
          onClick={() => handleTypeClick(filterItem.name)} // Update active filter on click
          className={cn(
            `body-medium rounded-lg px-6 py-3 capitalize shadow-none`,
            activeFilter !== filterItem.name
              ? 'bg-light800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light500 dark:hover:bg-dark-300'
              : 'bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-400 hover:dark:bg-dark-400'
          )}
        >
          {filterItem.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilter;