"use client";

import Image from "next/image";
import { Trophy, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { getPollByShortId } from "@/actions/poll/getPollByShortId";

type Poll = NonNullable<Awaited<ReturnType<typeof getPollByShortId>>> & {
  active: boolean;
};

interface PublicResultsViewProps {
  poll: Poll;
}

export function PublicResultsView({ poll }: PublicResultsViewProps) {
  const optionA = poll.options[0];
  const optionB = poll.options[1];

  const totalVotes = poll.votes.length;
  const votesA = poll.votes.filter((v) => v.option.position === "A").length;
  const votesB = poll.votes.filter((v) => v.option.position === "B").length;
  const pctA = totalVotes > 0 ? Math.round((votesA / totalVotes) * 100) : 0;
  const pctB = totalVotes > 0 ? Math.round((votesB / totalVotes) * 100) : 0;

  const winner = votesA > votesB ? "A" : votesB > votesA ? "B" : null;

  const votersA = poll.votes.filter((v) => v.option.position === "A");
  const votersB = poll.votes.filter((v) => v.option.position === "B");

  const options = [
    {
      option: optionA,
      votes: votesA,
      pct: pctA,
      position: "A" as const,
      voters: votersA,
    },
    {
      option: optionB,
      votes: votesB,
      pct: pctB,
      position: "B" as const,
      voters: votersB,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={poll.active ? "default" : "secondary"}>
            {poll.active ? "Live" : "Final Results"}
          </Badge>
          <span className="text-xs text-muted-foreground font-mono">
            #{poll.shortId}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="size-4" />
          {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
        </div>
      </div>

      {/* VS hero */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
        {options.map(({ option, votes, pct, position }) => {
          const isWinner = winner === position;
          const isLoser = winner !== null && winner !== position;

          return (
            <div
              key={option.id}
              className={cn(
                "relative rounded-2xl overflow-hidden border-2 transition-all",
                isWinner
                  ? "border-primary shadow-lg shadow-primary/20"
                  : "border-border",
                isLoser && "opacity-60",
              )}
            >
              {/* Cover */}
              <div className="relative aspect-3/4 w-full">
                <Image
                  src={option.cover}
                  alt={option.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />

                {/* Winner crown */}
                {isWinner && (
                  <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 rounded-full p-1.5">
                    <Trophy className="size-4" />
                  </div>
                )}

                <Badge className="absolute top-3 left-3">{position}</Badge>

                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1">
                  <p className="text-white text-xl font-bold leading-tight">
                    {option.name}
                  </p>
                  {option.description && (
                    <p className="text-white/70 text-sm line-clamp-2">
                      {option.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="p-4 bg-card space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-black">{pct}%</span>
                  <span className="text-sm text-muted-foreground">
                    {votes} vote{votes !== 1 ? "s" : ""}
                  </span>
                </div>
                <Progress
                  value={pct}
                  className={cn("h-2.5", isWinner && "*:bg-yellow-400")}
                />
              </div>
            </div>
          );
        })}

        {/* VS divider */}
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-px flex-1 bg-border" />
            <span className="text-2xl font-black text-muted-foreground/40 select-none">
              VS
            </span>
            <div className="w-px flex-1 bg-border" />
          </div>
        </div>
      </div>

      {/* Voter breakdown */}
      {totalVotes > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
            Voters
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {options.map(({ option, voters, position }) => (
              <div key={position} className="space-y-3">
                {/* Column header */}
                <div className="flex items-center gap-2 pb-2 border-b">
                  <div className="relative size-10 rounded-md overflow-hidden shrink-0 border">
                    <Image
                      src={option.cover}
                      alt={option.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {option.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {voters.length} voter{voters.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {voters.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">
                    No votes yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {voters.map((vote) => (
                      <div key={vote.id} className="flex items-center gap-2.5">
                        <Avatar className="size-8 shrink-0">
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
                            @{vote.user?.login}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
