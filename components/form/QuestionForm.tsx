'use client'

import { AskQuestionSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const QuestionForm = () => {
    const form = useForm({
        resolver: zodResolver(AskQuestionSchema),
        defaultValues: {
            title: '',
            description: '',
            tags: []
        }
    })

    const handleCreateQuestion = () => {
    }
  return (
    <Form {...form}>
        <form className='flex w-full flex-col gap-10' onSubmit={form.handleSubmit(handleCreateQuestion)}>
            <FormField
                control={form.control}
                name="Title"
                render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                    <FormLabel className="paragraph-semibold text-dark400_light700">
                    Question Title <span className='text-primary-500'>*</span>
                    </FormLabel>
                    <FormControl>
                    <Input
                        {...field}
                        className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px]   rounded-1.5 border"
                    />
                    </FormControl>
                    <FormDescription className="body-regular text-light-500 mt-2.5">
                         Be specific and imagine you’re asking a question to another person
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="Title"
                render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                    <FormLabel className="paragraph-semibold text-dark400_light700">
                    Detailed Explanation of your Problem <span className='text-primary-500'>*</span>
                    </FormLabel>
                    <FormControl>
                        Editor
                    </FormControl>
                    <FormDescription className="body-regular text-light-500 mt-2.5">
                         Introduce the problem and expand what in the title
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="Tags"
                render={({ field }) => (
                <FormItem className="flex w-full flex-col gap-3">
                    <FormLabel className="paragraph-semibold text-dark400_light700">
                    Tags <span className='text-primary-500'>*</span>
                    </FormLabel>
                    <FormControl>
                        <div>
                            <Input 
                                {...field}
                                className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                            />
                            Tags
                        </div>
                    </FormControl>
                    <FormDescription className="body-regular text-light-500 mt-2.5">
                         Add up to 5 tags to describe what your question is about. You need to press enter to add a tag
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />
            
            <div className='mt-16 flex justify-end'>
                <Button
                    disabled={form.formState.isSubmitting}
                    type="submit"
                    className="primary-gradient !text-light-900 w-fit"
                >
                    {form.formState.isSubmitting
                        ? "Creating Question..."
                        : "Create Question"
                    }
                </Button>
            </div>
        </form>
    </Form>
  )
}

export default QuestionForm