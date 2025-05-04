"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../supabase/client";
import { Plus, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Database } from "@/types/supabase";

type Channel = Database["public"]["Tables"]["channels"]["Row"];

export default function ChannelList({ userId }: { userId: string }) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const { data, error } = await supabase
          .from("channels")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setChannels(data || []);
      } catch (error) {
        console.error("Error fetching channels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();

    // Subscribe to new channels
    const channelsSubscription = supabase
      .channel("public:channels")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "channels" },
        (payload) => {
          setChannels((current) => [payload.new as Channel, ...current]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channelsSubscription);
    };
  }, [supabase]);

  const handleChannelClick = async (channelId: string) => {
    try {
      // Check if user is already a member of this channel
      const { data: existingMembership } = await supabase
        .from("channel_members")
        .select("*")
        .eq("channel_id", channelId)
        .eq("user_id", userId)
        .single();

      // If not a member, join the channel
      if (!existingMembership) {
        await supabase.from("channel_members").insert({
          channel_id: channelId,
          user_id: userId,
        });
      }

      // Navigate to the channel
      router.push(`/dashboard/channels/${channelId}`);
    } catch (error) {
      console.error("Error joining channel:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Channels</h2>
          <Button size="sm" variant="ghost" disabled>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-8 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Channels</h2>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => router.push("/dashboard/channels/new")}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-1">
        {channels.length > 0 ? (
          channels.map((channel) => (
            <button
              key={channel.id}
              className="flex items-center gap-2 w-full px-2 py-1.5 text-left rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => handleChannelClick(channel.id)}
            >
              <Hash className="h-4 w-4 text-gray-500" />
              <span className="truncate">{channel.name}</span>
            </button>
          ))
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No channels yet. Create one to get started!
          </p>
        )}
      </div>
    </div>
  );
}
