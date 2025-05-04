import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import ChannelList from "@/components/chat/channel-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ChannelsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get channels the user is a member of
  const { data: memberChannels } = await supabase
    .from("channel_members")
    .select("channel_id")
    .eq("user_id", user.id);

  const memberChannelIds = memberChannels?.map((m) => m.channel_id) || [];

  return (
    <>
      <DashboardNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Channels</h1>
          <Button asChild>
            <Link href="/dashboard/channels/new">Create Channel</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Your Channels</CardTitle>
              </CardHeader>
              <CardContent>
                <ChannelList userId={user.id} />
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1 lg:col-span-2">
            <Card className="h-full flex flex-col justify-center items-center p-8">
              <MessageSquare className="h-16 w-16 text-indigo-500 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Select a Channel</h2>
              <p className="text-gray-500 text-center mb-6">
                Choose a channel from the list or create a new one to start
                chatting.
              </p>
              <Button asChild>
                <Link href="/dashboard/channels/new">Create New Channel</Link>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
