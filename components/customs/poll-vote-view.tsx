"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  MoreHorizontal,
  Share2,
  Loader2,
  Check,
} from "lucide-react";
import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { voteOnPoll } from "@/actions/poll/voteOnPoll";
import type { getPollByShortId } from "@/actions/poll/getPollByShortId";

type Poll = NonNullable<Awaited<ReturnType<typeof getPollByShortId>>> & {
  active: boolean;
};

type CurrentUser = {
  id: string;
  login: string;
  name?: string | null;
  image?: string | null;
};

interface PollVoteViewProps {
  poll: Poll;
  currentUser: CurrentUser;
}

export function PollVoteView({ poll, currentUser }: PollVoteViewProps) {
  const [isPending, startTransition] = useTransition();
  const [userVote, setUserVote] = useState<"A" | "B" | null>(() => {
    const existingVote = poll.votes.find((v) => v.user?.id === currentUser.id);
    return existingVote?.option.position === "A"
      ? "A"
      : existingVote?.option.position === "B"
        ? "B"
        : null;
  });

  const optionA = poll.options.find((o) => o.position === "A");
  const optionB = poll.options.find((o) => o.position === "B");

  if (!optionA || !optionB) {
    return <div className="p-4 text-center">Invalid poll data</div>;
  }

  const handleVote = (position: "A" | "B", optionId: string) => {
    if (!poll.active || isPending) return;

    // Optimistic update
    const previousVote = userVote;
    setUserVote(position);

    startTransition(async () => {
      try {
        const res = await voteOnPoll({ shortId: poll.shortId, position });
        if ("error" in res) {
          toast.error(res.error ?? "Failed to vote");
          setUserVote(previousVote);
        } else {
          toast.success("Vote recorded!");
        }
      } catch {
        toast.error("Something went wrong");
        setUserVote(previousVote);
      }
    });
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const voteCount = poll.votes.length;

  return (
    <div className="font-display min-h-screen flex flex-col antialiased pb-24  selection:bg-[#8c2bee] selection:text-white justify-center items-center">
      <div className="w-full  bg-transparent mx-auto relative min-h-screen flex flex-col">
        {/* Header */}

        {/* Main Content */}
        <main className="flex-1 px-4 pt-2 pb-6 flex flex-col gap-6">
          {/* Question */}
          <div className="text-center space-y-2 py-2">
            <span className="inline-block px-3 py-1 rounded-full bg-[#8c2bee]/20 text-[#8c2bee] text-xs font-bold uppercase tracking-wider">
              {poll.active ? "Active Poll" : "Poll Ended"}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {poll.name}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {voteCount} Votes
            </p>
          </div>

          {/* Matchup Cards Area */}
          <div className="relative w-full">
            {/* VS Badge */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center pointer-events-none">
              <div className="w-12 h-12 bg-[#8c2bee] rounded-full border-4 border-slate-50 dark:border-[#191022] flex items-center justify-center shadow-[0_0_15px_rgba(140,43,238,0.5)]">
                <span className="text-white font-black text-sm italic">VS</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 h-[420px]">
              {/* Player 1 Card (Option A) */}
              <div className="group relative flex flex-col justify-end h-full rounded-xl overflow-hidden bg-[#2d2438] shadow-lg ring-1 ring-white/10">
                {/* Image Background */}
                <div className="absolute inset-0 bg-slate-800">
                  <Image
                    src={optionA.cover}
                    alt={optionA.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized
                  />
                </div>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>

                {/* Content */}
                <div className="relative z-10 p-4 flex flex-col gap-3 items-center text-center">
                  <div className="flex flex-col">
                    <h3 className="text-white text-lg font-bold leading-tight">
                      {optionA.name}
                    </h3>
                    <span className="text-white/60 text-xs font-medium">
                      Option A
                    </span>
                  </div>
                  <button
                    onClick={() => handleVote("A", optionA.id)}
                    disabled={isPending || !poll.active}
                    className={cn(
                      "w-full transition-all font-bold py-3 rounded-lg text-sm flex items-center justify-center gap-2",
                      userVote === "A"
                        ? "bg-[#8c2bee] hover:bg-[#7a25d0] text-white shadow-lg shadow-[#8c2bee]/25 border border-white/10"
                        : "bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10",
                      "active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed",
                    )}
                  >
                    {isPending && userVote === "A" && (
                      <Loader2 className="size-4 animate-spin" />
                    )}
                    <span>{userVote === "A" ? "Voted" : "Vote"}</span>
                  </button>
                </div>
              </div>

              {/* Player 2 Card (Option B) */}
              <div className="group relative flex flex-col justify-end h-full rounded-xl overflow-hidden bg-[#2d2438] shadow-lg ring-1 ring-white/10">
                {/* Image Background */}
                <div className="absolute inset-0 bg-slate-800">
                  <Image
                    src={optionB.cover}
                    alt={optionB.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized
                  />
                </div>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>

                {/* Content */}
                <div className="relative z-10 p-4 flex flex-col gap-3 items-center text-center">
                  <div className="flex flex-col">
                    <h3 className="text-white text-lg font-bold leading-tight">
                      {optionB.name}
                    </h3>
                    <span className="text-white/60 text-xs font-medium">
                      Option B
                    </span>
                  </div>
                  <button
                    onClick={() => handleVote("B", optionB.id)}
                    disabled={isPending || !poll.active}
                    className={cn(
                      "w-full transition-all font-bold py-3 rounded-lg text-sm flex items-center justify-center gap-2",
                      userVote === "B"
                        ? "bg-[#8c2bee] hover:bg-[#7a25d0] text-white shadow-lg shadow-[#8c2bee]/25 border border-white/10"
                        : "bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10",
                      "active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed",
                    )}
                  >
                    {isPending && userVote === "B" && (
                      <Loader2 className="size-4 animate-spin" />
                    )}
                    <span>{userVote === "B" ? "Voted" : "Vote"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Voters Section */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-slate-900 dark:text-white text-base font-bold">
                Recent Voters
              </h3>
              <button className="text-[#8c2bee] text-sm font-semibold hover:text-[#7a25d0]">
                View all
              </button>
            </div>
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
              {/* Stack of Avatars */}
              {poll.votes.length > 0 ? (
                <div className="flex -space-x-3 overflow-hidden p-1">
                  {poll.votes.slice(0, 5).map((vote) => (
                    <Avatar
                      key={vote.id}
                      className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-50 dark:ring-[#191022] object-cover"
                    >
                      <AvatarImage src={vote.user?.image ?? ""} />
                      <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                        {vote.user?.login?.[0]?.toUpperCase() ?? "?"}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {poll.votes.length > 5 && (
                    <div className="h-10 w-10 rounded-full ring-2 ring-slate-50 dark:ring-[#191022] bg-[#2d2438] flex items-center justify-center text-[10px] font-bold text-slate-300">
                      +{poll.votes.length - 5}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-500 px-1">
                  Be the first to vote!
                </p>
              )}

              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                people voted
              </div>
            </div>
          </div>
        </main>

        {/* Sticky Footer */}
      </div>
    </div>
  );
}
