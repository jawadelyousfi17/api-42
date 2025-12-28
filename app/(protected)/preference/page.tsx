import { getUserData } from "@/actions/user/getUserData";
import PreferencesForm from "./preferences-form";
import { redirect } from "next/navigation";

export default async function PreferencePage() {
  const user = await getUserData();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container py-10 space-y-6">
      <PreferencesForm user={user} />
    </div>
  );
}
