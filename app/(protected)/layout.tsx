import { auth } from "@/lib/auth/auth-provider";
import { redirect } from "next/navigation";
import Navbar from "@/components/customs/navbar";
import { getUserData } from "@/actions/user/getUserData";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const intraUser = await getUserData();

  return (
    <>
      <Navbar user={session.user} intraUser={intraUser} />
      {children}
    </>
  );
}
