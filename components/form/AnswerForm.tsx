"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Star } from "lucide-react";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import Tiptap from "@/context/Tiptap";
import { AnswerSchema } from "@/lib/validations";
import { createAnswer } from "@/lib/actions/answer.action";

export default function AnswerForm({ questionId, questionTitle, questionContent }: { questionId: string, questionTitle: string, questionContent: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isAISubmitting, setIsAISubmitting] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmit = (data: z.infer<typeof AnswerSchema>) => {
    setSubmitError(null);

    startTransition(() => {
      createAnswer({
        questionId,
        content: data.content,
      })
        .then((result) => {
          if (result.success) {
            form.reset({ content: "" });
            setEditorKey((currentKey) => currentKey + 1);
            setSubmitError(null);
            toast({
              title: "Success",
              description: "Your answer has been posted successfully",
            });

            router.refresh(); // utile se vuoi aggiornare la pagina
          } else {
            const message = result.error?.message || "Something went wrong";

            setSubmitError(message);
            toast({
              title: "Error",
              description: message,
              variant: "destructive",
            });
          }
        })
        .catch(() => {
          setSubmitError("Unexpected error");
        });
    });
  };

  const generateAIAnswer = async () => {
    setIsAISubmitting(true);
    try {
      const response = await fetch("/api/ai/answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          question: questionTitle,
          context: questionContent,
          draft: form.getValues("content"),
        }),
      });

      const result = (await response.json()) as {
        success: boolean;
        data?: string;
        remainingGenerations?: number;
        error?: {
          message: string;
          details?: Record<string, string[]>;
        };
      };

      if (!result.success || !result.data) {
        return toast({
          title: "Error",
          description: result.error?.message || "Unable to generate an answer",
          variant: "destructive",
        });
      }

      form.setValue("content", result.data, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setSubmitError(null);

      toast({
        title: "Success",
        description: `AI answer generated successfully. ${result.remainingGenerations ?? 0} generations left.`,
      });
    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "There was a problem with your request",
        variant: "destructive"
      })
    } finally {
      setIsAISubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-10"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <FormLabel className="paragraph-semibold text-dark400_light700">
                  Your Answer <span className="text-primary-500">*</span>
                </FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isAISubmitting}
                  onClick={generateAIAnswer}
                  className="border-primary-200 bg-primary-100 text-primary-500 hover:bg-primary-100/80 dark:border-primary-500/30 dark:bg-primary-500/10 dark:text-primary-400 dark:hover:bg-primary-500/20 w-full justify-center gap-2 rounded-full px-4 lg:w-auto"
                >
                  {isAISubmitting ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <Star className="size-4 fill-current" />
                  )}
                  {isAISubmitting ? "Generating..." : "Generate with AI"}
                </Button>
              </div>

              <FormControl>
                <div className="background-light800_darkgradient border-light-700 dark:border-dark-400 rounded-2xl border p-4 shadow-light-300 dark:shadow-none">
                  <Tiptap
                    key={editorKey}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Write a thoughtful answer with details, examples, or code snippets..."
                  />
                </div>
              </FormControl>

              <FormDescription className="body-regular text-light-500 mt-2.5">
                Provide a helpful answer with details and (if needed) code
                snippets.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        {submitError && (
          <p className="small-regular text-destructive mt-2 px-1">
            {submitError}
          </p>
        )}

        <div className="mt-16 flex justify-end">
          <Button
            disabled={isPending}
            type="submit"
            className="primary-gradient !text-light-900 w-fit"
          >
            {isPending && <LoaderCircle className="size-4 animate-spin" />}
            {isPending ? "Submitting..." : "Post Answer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
