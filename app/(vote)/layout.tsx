import { auth } from "@/lib/auth/auth-provider";
import { redirect } from "next/navigation";
import Navbar from "@/components/customs/navbar";
import { getUserData } from "@/actions/user/getUserData";
import { headers } from "next/headers";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    const headersList = await headers();
    const currentPath = headersList.get("x-url") || "";
    if (currentPath) {
      redirect(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
    } else {
      redirect("/login");
    }
  }

  const intraUser = await getUserData();

  return (
    <>
      {/* <Navbar user={session.user} /> */}
      <main className="px-4">{children}</main>
    </>
  );
}
