import CreatePollForm from "./create-poll-form";
import { auth } from "@/lib/auth/auth-provider";
import { redirect } from "next/navigation";

export default async function CreatePollPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="container py-10">
      <CreatePollForm />
    </div>
  );
}
