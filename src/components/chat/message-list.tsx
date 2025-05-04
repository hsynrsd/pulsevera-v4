"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createClient } from "../../../supabase/client";
import { Database } from "@/types/supabase";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MessageReaction from "./message-reaction";
import { Skeleton } from "@/components/ui/skeleton";

type Message = Database["public"]["Tables"]["messages"]["Row"] & {
  users: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

export default function MessageList({ channelId }: { channelId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Function to fetch messages - extracted for reusability
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("messages")
        .select("*, users:user_id(full_name, avatar_url)")
        .eq("channel_id", channelId)
        .order("created_at", { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setMessages(data || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages. Please try refreshing the page.");
    } finally {
      setLoading(false);
    }
  }, [channelId, supabase]);

  // Initial fetch and subscription setup
  useEffect(() => {
    // Fetch messages on component mount and channel change
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

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(messagesSubscription);
    };
  }, [channelId, supabase, fetchMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (!loading && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  // Handle retry when there's an error
  const handleRetry = () => {
    fetchMessages();
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-3 animate-pulse">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-10 w-full max-w-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={messagesContainerRef}
      className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900"
    >
      {messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Avatar className="border border-gray-200 dark:border-gray-700">
                <AvatarImage src={message.users?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {message.users?.full_name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {message.users?.full_name || "Unknown User"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {format(new Date(message.created_at), "MMM d, h:mm a")}
                  </span>
                </div>
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                  {message.content}
                </p>
                <MessageReaction
                  messageId={message.id}
                  userId={message.user_id}
                />
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium mb-2">No messages yet</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Be the first to start the conversation in this channel!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
