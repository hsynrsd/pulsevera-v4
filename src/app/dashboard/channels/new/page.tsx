import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import CreateChannelForm from "@/components/chat/create-channel-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewChannelPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <>
      <DashboardNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Create a New Channel</CardTitle>
            </CardHeader>
            <CardContent>
              <CreateChannelForm userId={user.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
