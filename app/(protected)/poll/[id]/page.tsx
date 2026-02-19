import { notFound } from "next/navigation";
import { getPollByShortId } from "@/actions/poll/getPollByShortId";
import { auth } from "@/lib/auth/auth-provider";
import { PollVoteView } from "@/components/customs/poll-vote-view";

interface PollPageProps {
  params: Promise<{ id: string }>;
}

export default async function PollPage({ params }: PollPageProps) {
  const { id } = await params;

  const [poll, session] = await Promise.all([getPollByShortId(id), auth()]);

  if (!poll || !session?.user?.id) notFound();

  const currentUser = {
    id: session.user.id,
    login: session.user.login,
    name: session.user.name ?? null,
    image: session.user.image ?? null,
  };

  return (
    <div className="container py-10">
      <PollVoteView poll={poll} currentUser={currentUser} />
    </div>
  );
}
