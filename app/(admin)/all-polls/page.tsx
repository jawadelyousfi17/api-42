import { getAllPolls } from "@/actions/poll/getAllPolls";
import { auth } from "@/lib/auth/auth-provider";
import { redirect } from "next/navigation";
import { PollCard } from "@/components/customs/poll-card";
import { LayoutGrid } from "lucide-react";

export default async function AllPollsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const polls = await getAllPolls();

  return (
    <div className="container py-10 space-y-6">
      <div className="flex items-center gap-3">
        <LayoutGrid className="size-5" />
        <div>
          <h1 className="text-xl font-semibold leading-none">All Polls</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {polls.length} poll{polls.length !== 1 ? "s" : ""} total
          </p>
        </div>
      </div>

      {polls.length === 0 ? (
        <div className="rounded-xl border border-dashed py-16 flex flex-col items-center gap-2 text-muted-foreground">
          <LayoutGrid className="size-8 opacity-30" />
          <p className="text-sm">No polls yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      )}
    </div>
  );
}
