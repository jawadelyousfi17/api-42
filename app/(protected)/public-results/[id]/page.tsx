import { notFound } from "next/navigation";
import { getPollByShortId } from "@/actions/poll/getPollByShortId";
import { auth } from "@/lib/auth/auth-provider";
import { redirect } from "next/navigation";
import { PublicResultsView } from "@/components/customs/public-results-view";

interface PublicResultsPageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicResultsPage({
  params,
}: PublicResultsPageProps) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id } = await params;
  const poll = await getPollByShortId(id);

  if (!poll) notFound();

  return (
    <div className="container py-10">
      <PublicResultsView poll={poll} />
    </div>
  );
}
