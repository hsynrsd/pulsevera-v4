"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../supabase/client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Database } from "@/types/supabase";

type MessageReaction = Database["public"]["Tables"]["message_reactions"]["Row"];

interface MessageReactionProps {
  messageId: string;
  userId: string;
}

const COMMON_REACTIONS = [
  { emoji: "👍", label: "Thumbs Up" },
  { emoji: "❤️", label: "Heart" },
  { emoji: "😂", label: "Laugh" },
  { emoji: "😮", label: "Wow" },
  { emoji: "😢", label: "Sad" },
  { emoji: "🎉", label: "Celebrate" },
];

export default function MessageReaction({
  messageId,
  userId,
}: MessageReactionProps) {
  const [reactions, setReactions] = useState<Record<string, MessageReaction[]>>(
    {},
  );
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchReactions = async () => {
      const { data, error } = await supabase
        .from("message_reactions")
        .select("*")
        .eq("message_id", messageId);

      if (error) {
        console.error("Error fetching reactions:", error);
        return;
      }

      // Group reactions by emoji
      const groupedReactions: Record<string, MessageReaction[]> = {};
      data?.forEach((reaction) => {
        if (!groupedReactions[reaction.emoji]) {
          groupedReactions[reaction.emoji] = [];
        }
        groupedReactions[reaction.emoji].push(reaction);
      });

      setReactions(groupedReactions);
    };

    fetchReactions();

    // Subscribe to reaction changes
    const reactionSubscription = supabase
      .channel(`message-reactions-${messageId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "message_reactions",
          filter: `message_id=eq.${messageId}`,
        },
        () => {
          fetchReactions();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(reactionSubscription);
    };
  }, [messageId, supabase]);

  const toggleReaction = async (emoji: string) => {
    // Check if user already reacted with this emoji
    const userReacted = reactions[emoji]?.some(
      (reaction) => reaction.user_id === userId,
    );

    if (userReacted) {
      // Remove reaction
      const reactionToDelete = reactions[emoji].find(
        (reaction) => reaction.user_id === userId,
      );

      if (reactionToDelete) {
        const { error } = await supabase
          .from("message_reactions")
          .delete()
          .eq("id", reactionToDelete.id);

        if (error) console.error("Error removing reaction:", error);
      }
    } else {
      // Add reaction
      const { error } = await supabase.from("message_reactions").insert({
        message_id: messageId,
        user_id: userId,
        emoji,
      });

      if (error) console.error("Error adding reaction:", error);
    }

    setShowReactionPicker(false);
  };

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {/* Display existing reactions */}
      {Object.entries(reactions).map(([emoji, users]) => (
        <TooltipProvider key={emoji}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-6 px-2 py-1 text-xs rounded-full bg-muted hover:bg-muted/80"
                onClick={() => toggleReaction(emoji)}
              >
                <span className="mr-1">{emoji}</span>
                <span>{users.length}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {users
                  .map((reaction) =>
                    reaction.user_id === userId ? "You" : "User",
                  )
                  .join(", ")}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}

      {/* Reaction picker button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 rounded-full"
              onClick={() => setShowReactionPicker(!showReactionPicker)}
            >
              <span className="text-xs">+</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add reaction</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Reaction picker */}
      {showReactionPicker && (
        <div className="absolute z-10 bg-background border rounded-md p-1 shadow-md flex gap-1">
          {COMMON_REACTIONS.map((reaction) => (
            <TooltipProvider key={reaction.emoji}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => toggleReaction(reaction.emoji)}
                  >
                    <span className="text-lg">{reaction.emoji}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{reaction.label}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      )}
    </div>
  );
}
