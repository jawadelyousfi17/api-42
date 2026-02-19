"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, Flame } from "lucide-react";

import type { getPollByShortId } from "@/actions/poll/getPollByShortId";
import { cn } from "@/lib/utils";

type Poll = NonNullable<Awaited<ReturnType<typeof getPollByShortId>>> & {
  active: boolean;
};

interface AnonymousResultsViewProps {
  poll: Poll;
}

export function AnonymousResultsView({ poll }: AnonymousResultsViewProps) {
  const router = useRouter();

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 5000);
    return () => clearInterval(interval);
  }, [router]);

  const totalVotes = poll.votes.length;
  const votesA = poll.votes.filter((v) => v.option.position === "A").length;
  const votesB = poll.votes.filter((v) => v.option.position === "B").length;

  // Calculate dynamic scale base: starts at 20, increases to next multiple of 10 if exceeded
  const maxVotes = Math.max(votesA, votesB);
  const baseScale = Math.max(20, Math.ceil(maxVotes / 10) * 10);

  const options = [
    {
      label: "Player 1",
      votes: votesA,
      position: "A",
    },
    {
      label: "Player 2",
      votes: votesB,
      position: "B",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background antialiased pb-6">
      <main className="flex-1 px-4 pt-2 pb-6 flex flex-col gap-8 max-w-md mx-auto w-full">
        {/* Title */}
        <div className="text-center space-y-2 py-4">
          <h1 className="text-3xl font-extrabold text-foreground leading-tight">
            {poll.name}
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Users className="size-4" />
            <span>{totalVotes} total votes</span>
          </div>
        </div>

        {/* Results Bars - Vertical */}
        <div className="flex justify-center items-end gap-12 h-[300px] mt-22 mb-12 relative w-full max-w-[320px] mx-auto">
          {/* Background Grid Lines (optional for scale reference) */}
          <div className="absolute inset-0 w-full h-full flex flex-col justify-between pointer-events-none opacity-20 z-0">
            {[0, 0.25, 0.5, 0.75, 1].map((step) => (
              <div
                key={step}
                className="w-full border-t border-dashed border-foreground"
              />
            ))}
          </div>

          {options.map((opt) => (
            <div
              key={opt.position}
              className="flex flex-col items-center gap-4 h-full justify-end z-10 relative group"
            >
              <div
                className={cn(
                  "w-[90px] rounded-t-2xl transition-all duration-1000 ease-out shadow-[0_-4px_20px_rgba(0,0,0,0.1)] border-b-0",
                  opt.position === "A"
                    ? "bg-indigo-500 border-2 border-indigo-400"
                    : "bg-orange-500 border-2 border-orange-400",
                )}
                style={{
                  height: `${(opt.votes / baseScale) * 100}%`,
                  minHeight: opt.votes > 0 ? "4px" : "0",
                }}
              />
              <div className="text-center min-w-[80px]">
                <span className="text-[11px] font-black text-foreground uppercase tracking-wider block opacity-70">
                  {opt.label}
                </span>
                <span className="text-3xl font-black text-foreground block mt-1 tabular-nums tracking-tight">
                  {opt.votes}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground block uppercase tracking-wider">
                  votes
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
