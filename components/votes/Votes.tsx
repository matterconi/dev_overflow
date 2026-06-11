'use client'

import { submitVote } from "@/lib/actions/vote.action";
import { toast } from "@/hooks/use-toast";
import { formatNumber } from "@/lib/utils";
import type { ActionResponse, HasVotedResponse } from "@/types/action";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { use, useState } from "react";

interface VotesProps {
  targetId: string;
  targetType: "question" | "answer";
  upvotes: number;
  downvotes: number;
  hasVotedPromise: Promise<ActionResponse<HasVotedResponse>>;
}



const Votes = ({
  targetId,
  targetType,
  upvotes,
  downvotes,
  hasVotedPromise,
}: VotesProps) => {
    const { data } = use(hasVotedPromise);
    const session = useSession();
    const userId = session.data?.user?.id;
    const [voteState, setVoteState] = useState({
      hasUpvoted: data?.hasUpvoted ?? false,
      hasDownvoted: data?.hasDownvoted ?? false,
      upvotes,
      downvotes,
    });
    const [isLoading, setIsloading] = useState(false);

    const handleVote = async (voteType: "upvote" | "downvote") => {
        if (!userId) return toast({
            title: "Please log in to vote",
            description: "Only logged-in users can vote.",
            variant: "destructive",
        })
        setIsloading(true);
        try {
            const result = await submitVote({
              targetId,
              targetType,
              voteType,
            });

            if (!result.success) {
              return toast({
                title: "Failed to vote",
                description: result.error?.message || "An error occured while voting. Please try again later",
                variant: "destructive",
              });
            }

            let nextState = voteState;

            if (voteType === "upvote") {
              if (voteState.hasUpvoted) {
                nextState = {
                  ...voteState,
                  hasUpvoted: false,
                  upvotes: voteState.upvotes - 1,
                };
              } else if (voteState.hasDownvoted) {
                nextState = {
                  ...voteState,
                  hasUpvoted: true,
                  hasDownvoted: false,
                  upvotes: voteState.upvotes + 1,
                  downvotes: voteState.downvotes - 1,
                };
              } else {
                nextState = {
                  ...voteState,
                  hasUpvoted: true,
                  upvotes: voteState.upvotes + 1,
                };
              }
            } else {
              if (voteState.hasDownvoted) {
                nextState = {
                  ...voteState,
                  hasDownvoted: false,
                  downvotes: voteState.downvotes - 1,
                };
              } else if (voteState.hasUpvoted) {
                nextState = {
                  ...voteState,
                  hasUpvoted: false,
                  hasDownvoted: true,
                  upvotes: voteState.upvotes - 1,
                  downvotes: voteState.downvotes + 1,
                };
              } else {
                nextState = {
                  ...voteState,
                  hasDownvoted: true,
                  downvotes: voteState.downvotes + 1,
                };
              }
            }

            setVoteState(nextState);

            const successMessage =
              voteType === "upvote"
                ? voteState.hasUpvoted
                  ? "Upvote removed successfully"
                  : "Upvote added successfully"
                : voteState.hasDownvoted
                  ? "Downvote removed successfully"
                  : "Downvote added successfully";

            toast({
              title: "Success",
              description: successMessage,
            });
        } catch (e) {
            toast({
                title: "Failed to vote",
                description: "An error occured while voting. Please try again later",
                variant: "destructive",
            })
        } finally {
            setIsloading(false);
        }
    };
  return (
    <div className="flex-center gap-2.5">
      <div className="flex-center gap-1.5">
        <Image 
            src={voteState.hasUpvoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"}
            width={18}
            height={18}
            alt="upvote"
            className={`cursor-pointer ${isLoading && 'opacity-50'}`}
            aria-label="Upvote"
            onClick={() => !isLoading && handleVote("upvote")}
        />
        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
                {formatNumber(voteState.upvotes)}
            </p>
        </div>
      </div>
      <div className="flex-center gap-1.5">
        <Image
          src={voteState.hasDownvoted ? "/icons/downvoted.svg" : "/icons/downvote.svg"}
          width={18}
          height={18}
          alt="downvote"
          className={`cursor-pointer ${isLoading && 'opacity-50'}`}
          aria-label="Downvote"
          onClick={() => !isLoading && handleVote("downvote")}
        />
        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(voteState.downvotes)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Votes;
