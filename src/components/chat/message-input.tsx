"use client";

import { useState } from "react";
import { createClient } from "../../../supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

export default function MessageInput({
  channelId,
  userId,
}: {
  channelId: string;
  userId: string;
}) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sending) return;

    try {
      setSending(true);
      const { error } = await supabase.from("messages").insert({
        channel_id: channelId,
        user_id: userId,
        content: message.trim(),
      });

      if (error) throw error;
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="min-h-[60px] resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <Button type="submit" size="icon" disabled={!message.trim() || sending}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
