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
import Tiptap from '@/context/Tiptap'
import { z } from 'zod'
import TagCard from '../cards/TagCard'

const QuestionForm = () => {
    const form = useForm<z.infer<typeof AskQuestionSchema>>({
        resolver: zodResolver(AskQuestionSchema),
        defaultValues: {
            title: '',
            description: '',
            tags: []
        }
    })

    const handleTagRemove = (tag: string, field: {value: string[]}) => {
        form.setValue('tags', field.value.filter((t: string) => t !== tag))

        console.log(field.value.length);
        
        if (field.value.length === 1) {
            form.setError('tags', {
                type: 'manual',
                message: 'Tags are required'
            })
        }
    }

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: { value: string[]}) => {
        console.log(e.currentTarget.value);
        if (e.key === 'Enter') {
            e.preventDefault()
            const tagInput = e.currentTarget.value.trim()
            if (tagInput && tagInput.length < 15 && field.value.length < 5 && !field.value.includes(tagInput)) {
                form.setValue('tags', [...field.value, tagInput])
                e.currentTarget.value = ''
                form.clearErrors('tags')
            } else if (tagInput.length > 15) {
                form.setError('tags', {
                    type: 'maxLength',
                    message: 'Tag must be less than 15 characters'
                })
            } else if (field.value.length >= 5) {
                form.setError('tags', {
                    type: 'maxLength',
                    message: 'You can only add up to 5 tags'
                })
            } else if (field.value.includes(tagInput)) {
                form.setError('tags', {
                    type: 'duplicate',
                    message: 'Tag already exists'
                })
            }
        }
    }

    const handleCreateQuestion = (data: z.infer<typeof AskQuestionSchema>) => {
        console.log(data);
    }
  return (
    <Form {...form}>
        <form className='flex w-full flex-col gap-10' onSubmit={form.handleSubmit(handleCreateQuestion)}>
            <FormField
                control={form.control}
                name="title"
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
                name="content"
                render={({ field }) => (
                    <FormItem className="flex w-full flex-col">
                    <FormLabel className="paragraph-semibold text-dark400_light700">
                        Detailed Explanation of your Problem <span className="text-primary-500">*</span>
                    </FormLabel>
                    <FormControl>
                        {/* Pass value and onChange to EditorWithTheme */}
                        <Tiptap value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormDescription className="body-regular text-light-500 mt-2.5">
                        Introduce the problem and expand what is in the title
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                    <FormLabel className="paragraph-semibold text-dark400_light700">
                    Tags <span className='text-primary-500'>*</span>
                    </FormLabel>
                    <FormControl>
                        <div>
                            <Input 
                                className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                                placeholder='Add tags...'
                                onKeyDown={(e) => handleInputKeyDown(e, field)}
                            />
                            <div className='flex flex-wrap'>
                                {field?.value?.length > 0 && field.value.map((tag: string) => (
                                    <div key={tag} className='flex mt-5 mb-2.5 gap-2.5'>
                                        <TagCard _id={tag} name={tag} compact remove isButton handleRemove={()=>handleTagRemove(tag, field)}/>
                                    </div>
                                ))}
                            </div>
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
                    onClick={form.handleSubmit(handleCreateQuestion)}
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