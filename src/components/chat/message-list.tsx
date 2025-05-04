"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "../../../supabase/client";
import { Database } from "@/types/supabase";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Message = Database["public"]["Tables"]["messages"]["Row"] & {
  users: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

export default function MessageList({ channelId }: { channelId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*, users:user_id(full_name, avatar_url)")
          .eq("channel_id", channelId)
          .order("created_at", { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to new messages in this channel
    const messagesSubscription = supabase
      .channel(`public:messages:channel_id=eq.${channelId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `channel_id=eq.${channelId}`,
        },
        async (payload) => {
          // Fetch user details for the new message
          const { data: userData } = await supabase
            .from("users")
            .select("full_name, avatar_url")
            .eq("id", payload.new.user_id)
            .single();

          const newMessage = {
            ...payload.new,
            users: userData,
          } as Message;

          setMessages((current) => [...current, newMessage]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesSubscription);
    };
  }, [channelId, supabase]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-1">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-10 w-64 bg-gray-100 dark:bg-gray-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start gap-3">
              <Avatar>
                <AvatarImage src={message.users?.avatar_url || undefined} />
                <AvatarFallback>
                  {message.users?.full_name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {message.users?.full_name || "Unknown User"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(message.created_at), "MMM d, h:mm a")}
                  </span>
                </div>
                <p className="text-gray-800 dark:text-gray-200">
                  {message.content}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 dark:text-gray-400">
            No messages yet. Start the conversation!
          </p>
        </div>
      )}
    </div>
  );
}
