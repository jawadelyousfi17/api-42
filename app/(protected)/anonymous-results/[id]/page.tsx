import { notFound } from "next/navigation";
import { getPollByShortId } from "@/actions/poll/getPollByShortId";
import { AnonymousResultsView } from "@/components/customs/anonymous-results-view";

interface AnonymousResultsPageProps {
  params: Promise<{ id: string }>;
}

export default async function AnonymousResultsPage({
  params,
}: AnonymousResultsPageProps) {
  const { id } = await params;

  const poll = await getPollByShortId(id);

  if (!poll) notFound();

  return <AnonymousResultsView poll={poll} />;
}
