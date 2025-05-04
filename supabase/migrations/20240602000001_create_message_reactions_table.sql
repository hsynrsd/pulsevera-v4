-- Create message_reactions table
CREATE TABLE IF NOT EXISTS message_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(message_id, user_id, emoji)
);

-- Enable RLS on message_reactions table
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;

-- Create policies for message_reactions
DROP POLICY IF EXISTS "Users can view message reactions" ON message_reactions;
CREATE POLICY "Users can view message reactions"
  ON message_reactions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM messages
    JOIN channel_members ON messages.channel_id = channel_members.channel_id
    WHERE messages.id = message_reactions.message_id
    AND channel_members.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can add reactions to messages" ON message_reactions;
CREATE POLICY "Users can add reactions to messages"
  ON message_reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id AND EXISTS (
    SELECT 1 FROM messages
    JOIN channel_members ON messages.channel_id = channel_members.channel_id
    WHERE messages.id = message_reactions.message_id
    AND channel_members.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can remove their own reactions" ON message_reactions;
CREATE POLICY "Users can remove their own reactions"
  ON message_reactions FOR DELETE
  USING (auth.uid() = user_id);

-- Enable realtime for message_reactions table
alter publication supabase_realtime add table message_reactions;
