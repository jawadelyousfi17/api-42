"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, Users, Lock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { voteOnPoll } from "@/actions/poll/voteOnPoll";
import { PollOptionPosition } from "@/lib/generated/prisma";
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

export function PollVoteView({
  poll: initialPoll,
  currentUser,
}: PollVoteViewProps) {
  const [poll, setPoll] = useState(initialPoll);
  const [voting, setVoting] = useState(false);

  const optionA = poll.options[0];
  const optionB = poll.options[1];

  const myVote = poll.votes.find((v) => v.user?.id === currentUser.id);
  const myPosition = myVote?.option.position ?? null;

  const totalVotes = poll.votes.length;
  const votesA = poll.votes.filter((v) => v.option.position === "A").length;
  const votesB = poll.votes.filter((v) => v.option.position === "B").length;
  const pctA = totalVotes > 0 ? Math.round((votesA / totalVotes) * 100) : 0;
  const pctB = totalVotes > 0 ? Math.round((votesB / totalVotes) * 100) : 0;

  const handleVote = async (position: PollOptionPosition) => {
    if (!poll.active || voting) return;

    // optimistic update
    const targetOption = poll.options.find((o) => o.position === position)!;
    setPoll((prev) => {
      const withoutMyVote = prev.votes.filter(
        (v) => v.user?.id !== currentUser.id,
      );
      return {
        ...prev,
        votes: [
          ...withoutMyVote,
          {
            id: "optimistic",
            pollId: prev.id,
            optionId: targetOption.id,
            userId: currentUser.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            option: { id: targetOption.id, position },
            user: {
              id: currentUser.id,
              login: currentUser.login,
              name: currentUser.name ?? null,
              image: currentUser.image ?? null,
            },
          },
        ],
      };
    });

    setVoting(true);
    try {
      const res = await voteOnPoll({ shortId: poll.shortId, position });
      if ("error" in res) {
        toast.error(res.error ?? "Failed to vote");
        setPoll(initialPoll); // rollback
      }
    } catch {
      toast.error("Failed to vote");
      setPoll(initialPoll);
    } finally {
      setVoting(false);
    }
  };

  const votersA = poll.votes.filter((v) => v.option.position === "A");
  const votersB = poll.votes.filter((v) => v.option.position === "B");

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={poll.active ? "default" : "secondary"}>
            {poll.active ? "Active" : "Closed"}
          </Badge>
          {!poll.active && (
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Lock className="size-3" /> Voting is disabled
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="size-4" />
          {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-4">
        {(
          [
            {
              option: optionA,
              votes: votesA,
              pct: pctA,
              position: "A" as const,
            },
            {
              option: optionB,
              votes: votesB,
              pct: pctB,
              position: "B" as const,
            },
          ] as const
        ).map(({ option, votes, pct, position }) => {
          const isMyVote = myPosition === position;
          const canVote = poll.active && !voting;

          return (
            <button
              key={option.id}
              type="button"
              disabled={!canVote}
              onClick={() => handleVote(position)}
              className={cn(
                "cursor-pointer group relative rounded-xl overflow-hidden border-2 transition-all text-left w-full",
                "disabled:pointer-events-none",
                isMyVote
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border hover:border-primary/50",
                !poll.active && "cursor-default",
              )}
            >
              {/* Anonymous player block */}
              <div className="relative aspect-4/3 w-full bg-muted flex items-center justify-center">
                <span className="text-4xl font-black text-muted-foreground/30 select-none">
                  {position === "A" ? "1" : "2"}
                </span>
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                {/* Your vote badge */}
                {isMyVote && (
                  <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1">
                    <CheckCircle2 className="size-4" />
                  </div>
                )}

                <Badge className="absolute top-3 left-3 text-xs">
                  {position}
                </Badge>

                {/* Anonymous label only */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-semibold text-base leading-tight">
                    Player {position === "A" ? 1 : 2}
                  </p>
                </div>
              </div>

              {/* Stats bar */}
              <div className="p-3 space-y-1.5 bg-card">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    {votes} vote{votes !== 1 ? "s" : ""}
                  </span>
                  <span className="font-semibold">{pct}%</span>
                </div>
                <Progress value={pct} className="h-2" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Voter list */}
      {totalVotes > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Who voted
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {(
              [
                { voters: votersA, label: "Player 1", position: "A" },
                { voters: votersB, label: "Player 2", position: "B" },
              ] as const
            ).map(({ voters, label, position }) => (
              <div key={position} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {position}
                  </Badge>
                  <span className="text-sm font-medium truncate">{label}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {voters.length}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {voters.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      No votes yet
                    </p>
                  ) : (
                    voters.map((vote) => (
                      <div
                        key={vote.id}
                        className="flex items-center gap-2 py-1"
                      >
                        <Avatar className="size-7 shrink-0">
                          <AvatarImage src={vote.user?.image ?? ""} />
                          <AvatarFallback className="text-xs">
                            {(vote.user?.login?.[0] ?? "?").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium leading-none truncate">
                            {vote.user?.name ?? vote.user?.login ?? "Unknown"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {vote.user?.login}
                          </p>
                        </div>
                        {vote.user?.id === currentUser.id && (
                          <Badge className="ml-auto text-[10px] shrink-0">
                            You
                          </Badge>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
