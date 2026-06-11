"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";
import ROUTES from "@/constants/routes";

interface Props {
  type: "question" | "answer";
  itemId: string;
}

const EditDeleteAction = ({ type, itemId }: Props) => {
  const router = useRouter();

  const handleEdit = () => {
    router.push(ROUTES.EDIT_QUESTION(itemId));
  };

  const handleDelete = async () => {
    if (type === "question") {
      await deleteQuestion({ questionId: itemId });

      toast({
        title: "Question Deleted",
        variant: "destructive",
        description: "Your question has been successfully deleted.",
      });
    } else if (type === "answer") {
      await deleteAnswer({ answerId: itemId });

      toast({
        title: "Answer Deleted",
        variant: "destructive",
        description: "Your answer has been successfully deleted.",
      });
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 max-sm:w-full">
      {type === "question" && (
        <Image
          src="/icons/edit.svg"
          alt="edit"
          width={14}
          height={14}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Image
            src="/icons/trash.svg"
            alt="delete"
            width={14}
            height={14}
            className="cursor-pointer object-contain"
          />
        </AlertDialogTrigger>

        <AlertDialogContent className="background-light900_dark200 border-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-dark100_light900 h3-bold">
              Are you sure you want to delete this{" "}
              {type === "question" ? "question" : "answer"}?
            </AlertDialogTitle>
            <AlertDialogDescription className="body-regular text-dark500_light700 mt-2">
              This action cannot be undone. The{" "}
              {type === "question" ? "question" : "answer"} will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="btn-secondary text-dark300_light900 body-medium min-h-[46px] px-4">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="!bg-primary-500 body-medium min-h-[46px] px-4 text-white hover:!bg-primary-500/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditDeleteAction;
