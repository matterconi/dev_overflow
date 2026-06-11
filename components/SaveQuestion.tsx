"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { toggleSaveQuestion } from "@/lib/actions/collection.action";
import { toast } from "@/hooks/use-toast";

interface SaveQuestionProps {
  questionId: string;
  hasSaved?: boolean;
}

const SaveQuestion = ({ questionId, hasSaved = false }: SaveQuestionProps) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [isSaved, setIsSaved] = useState(hasSaved);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!userId) {
      return toast({
        title: "Please log in to save questions",
        description: "Only logged-in users can save questions.",
        variant: "destructive",
      });
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      const result = await toggleSaveQuestion({ questionId });

      if (!result.success) {
        return toast({
          title: "Failed to save question",
          description:
            result.error?.message ??
            "An error occurred while saving. Please try again later.",
          variant: "destructive",
        });
      }

      const saved = result.data?.saved ?? !isSaved;
      setIsSaved(saved);

      toast({
        title: saved ? "Question saved" : "Question unsaved",
        description: saved
          ? "This question has been added to your collection."
          : "This question has been removed from your collection.",
      });
    } catch (e) {
      toast({
        title: "Failed to save question",
        description:
          e instanceof Error
            ? e.message
            : "An error occurred while saving. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Image
      src={isSaved ? "/icons/star-filled.svg" : "/icons/star.svg"}
      width={18}
      height={18}
      alt={isSaved ? "Unsave question" : "Save question"}
      aria-label={isSaved ? "Unsave question" : "Save question"}
      className={`cursor-pointer invert-colors ${isLoading ? "opacity-50" : ""}`}
      style={{ width: 18, height: 18 }}
      onClick={handleSave}
    />
  );
};

export default SaveQuestion;
