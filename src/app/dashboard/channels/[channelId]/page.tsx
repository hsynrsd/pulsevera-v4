import { createClient } from "../../../../../supabase/server";
import { redirect, notFound } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import MessageList from "@/components/chat/message-list";
import MessageInput from "@/components/chat/message-input";
import ChannelList from "@/components/chat/channel-list";
import { Card } from "@/components/ui/card";

export default async function ChannelPage({
  params,
}: {
  params: { channelId: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Check if channel exists
  const { data: channel } = await supabase
    .from("channels")
    .select("*")
    .eq("id", params.channelId)
    .single();

  if (!channel) {
    return notFound();
  }

  // Check if user is a member of this channel
  const { data: membership } = await supabase
    .from("channel_members")
    .select("*")
    .eq("channel_id", params.channelId)
    .eq("user_id", user.id)
    .single();

  // If not a member, add them
  if (!membership) {
    await supabase.from("channel_members").insert({
      channel_id: params.channelId,
      user_id: user.id,
    });
  }

  return (
    <>
      <DashboardNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          {/* Channel Sidebar */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <Card className="h-full">
              <ChannelList userId={user.id} />
            </Card>
          </div>

          {/* Chat Area */}
          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <Card className="h-full flex flex-col">
              {/* Channel Header */}
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold"># {channel.name}</h2>
                {channel.description && (
                  <p className="text-sm text-gray-500">{channel.description}</p>
                )}
              </div>

              {/* Messages */}
              <MessageList channelId={params.channelId} />

              {/* Message Input */}
              <MessageInput channelId={params.channelId} userId={user.id} />
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
