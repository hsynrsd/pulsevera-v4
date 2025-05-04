"use client";

import { useState } from "react";
import { createClient } from "../../../supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

export default function CreateChannelForm({ userId }: { userId: string }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      setError(null);

      // Create the channel
      const { data: channel, error: channelError } = await supabase
        .from("channels")
        .insert({
          name: name.trim(),
          description: description.trim() || null,
          created_by: userId,
        })
        .select()
        .single();

      if (channelError) throw channelError;

      // Add the creator as a member
      const { error: memberError } = await supabase
        .from("channel_members")
        .insert({
          channel_id: channel.id,
          user_id: userId,
        });

      if (memberError) throw memberError;

      // Navigate to the new channel
      router.push(`/dashboard/channels/${channel.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to create channel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Channel Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="general"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's this channel about?"
          rows={3}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={!name.trim() || loading}>
          {loading ? "Creating..." : "Create Channel"}
        </Button>
      </div>
    </form>
  );
}
