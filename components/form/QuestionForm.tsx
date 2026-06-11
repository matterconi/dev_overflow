"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ROUTES from "@/constants/routes";
import Tiptap from "@/context/Tiptap";
import { toast } from "@/hooks/use-toast";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { AskQuestionSchema } from "@/lib/validations";
import { Question } from "@/types/global";

import TagCard from "../cards/TagCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const QuestionForm = ({
  question,
  isEdit,
}: {
  question?: Question;
  isEdit?: boolean;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof AskQuestionSchema>>({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: question?.title || "",
      content: question?.content || "",
      tags:
        question?.tags
          .map((tag) => tag.name.trim().toLowerCase())
          .filter(Boolean) || [],
    },
  });

  const normalizeTag = (value: string) => value.trim().toLowerCase();

  const handleTagRemove = (tag: string, field: { value: string[] }) => {
    const tagToRemove = normalizeTag(tag);
    form.setValue(
      "tags",
      field.value.filter((t: string) => normalizeTag(t) !== tagToRemove)
    );

    console.log(field.value.length);

    if (field.value.length === 1) {
      form.setError("tags", {
        type: "manual",
        message: "Tags are required",
      });
    }
  };

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: { value: string[] }
  ) => {
    console.log(e.currentTarget.value);
    if (e.key === "Enter") {
      e.preventDefault();
      const tagInputRaw = e.currentTarget.value;
      const tagInput = normalizeTag(tagInputRaw);
      const existingNormalized = field.value.map(normalizeTag);
      if (
        tagInput &&
        tagInput.length < 15 &&
        field.value.length < 5 &&
        !existingNormalized.includes(tagInput)
      ) {
        form.setValue("tags", [...field.value, tagInput]);
        e.currentTarget.value = "";
        form.clearErrors("tags");
      } else if (tagInput.length > 15) {
        form.setError("tags", {
          type: "maxLength",
          message: "Tag must be less than 15 characters",
        });
      } else if (field.value.length >= 5) {
        form.setError("tags", {
          type: "maxLength",
          message: "You can only add up to 5 tags",
        });
      } else if (existingNormalized.includes(tagInput)) {
        form.setError("tags", {
          type: "duplicate",
          message: "Tag already exists",
        });
      }
    }
  };

  const handleCreateQuestion = async (
    data: z.infer<typeof AskQuestionSchema>
  ) => {
    startTransition(async () => {
      try {
        if (isEdit && question) {
          const result = await editQuestion({
            questionId: question._id,
            title: data.title,
            content: data.content,
            tags: data.tags,
          });

          if (result.success) {
            toast({
              title: "Success",
              description: "Question updated successfully",
            });
            console.log("Question updated successfully");
          }

          if (result.data) {
            const destination = ROUTES.QUESTIONS(String(result.data?._id));
            console.log("Navigating to:", destination);
            router.push(destination);
          } else {
            console.error("Question update failed:", {
              status: result.status,
              error: result.error,
            });
            toast({
              title: `Error ${result.status}`,
              description: result.error?.message || "something went wrong",
              variant: "destructive",
            });
          }

          return;
        }
        const result = await createQuestion(data);
        console.log("createQuestion result:", result);

        if (result.success) {
          toast({
            title: "Success",
            description: "Question created successfully",
          });
          console.log("Question created successfully");
        }

        if (result.data) {
          const destination = ROUTES.QUESTIONS(String(result.data?._id));
          console.log("Navigating to:", destination);
          router.push(destination);
        } else {
          console.error("Question creation failed:", {
            status: result.status,
            error: result.error,
          });
          toast({
            title: `Error ${result.status}`,
            description: result.error?.message || "something went wrong",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("[QuestionForm] Unexpected error during submit:", error);
        toast({
          title: "Unexpected Error",
          description:
            "An unexpected error occurred while creating the question",
          variant: "destructive",
        });
      } finally {
        console.groupEnd();
      }
    });
  };
  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-10"
        onSubmit={form.handleSubmit(handleCreateQuestion)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light700">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px]   rounded-1.5 border"
                />
              </FormControl>
              <FormDescription className="body-regular text-light-500 mt-2.5">
                Be specific and imagine you’re asking a question to another
                person
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
                Detailed Explanation of your Problem{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Tiptap
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Describe your problem in detail, including what you expected, what happened, and any code you've tried..."
                />
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
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <div>
                  <Input
                    className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                    placeholder="Add tags..."
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />
                  <div className="flex flex-wrap">
                    {field?.value?.length > 0 &&
                      field.value.map((tag: string) => (
                        <div key={tag} className="flex mt-5 mb-2.5 gap-2.5">
                          <TagCard
                            _id={tag}
                            name={tag}
                            compact
                            remove
                            isButton
                            handleRemove={() => handleTagRemove(tag, field)}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </FormControl>
              <FormDescription className="body-regular text-light-500 mt-2.5">
                Add up to 5 tags to describe what your question is about. You
                need to press enter to add a tag
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-16 flex justify-end">
          <Button
            disabled={isPending}
            type="submit"
            className="primary-gradient !text-light-900 w-fit"
            onClick={form.handleSubmit(handleCreateQuestion)}
          >
            {isPending
              ? "Submitting..."
              : isEdit
                ? "Update Question"
                : "Ask Question"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuestionForm;
