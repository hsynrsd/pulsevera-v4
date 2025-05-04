-- Create channels table
CREATE TABLE IF NOT EXISTS channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create channel_members table for tracking which users have joined which channels
CREATE TABLE IF NOT EXISTS channel_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(channel_id, user_id)
);

-- Enable RLS on tables
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_members ENABLE ROW LEVEL SECURITY;

-- Create policies for channels
DROP POLICY IF EXISTS "Users can view all channels" ON channels;
CREATE POLICY "Users can view all channels"
  ON channels FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can create channels" ON channels;
CREATE POLICY "Users can create channels"
  ON channels FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Create policies for messages
DROP POLICY IF EXISTS "Users can view messages in channels they've joined" ON messages;
CREATE POLICY "Users can view messages in channels they've joined"
  ON messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM channel_members
    WHERE channel_members.channel_id = messages.channel_id
    AND channel_members.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can insert messages in channels they've joined" ON messages;
CREATE POLICY "Users can insert messages in channels they've joined"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM channel_members
      WHERE channel_members.channel_id = messages.channel_id
      AND channel_members.user_id = auth.uid()
    )
  );

-- Create policies for channel_members
DROP POLICY IF EXISTS "Users can view channel members" ON channel_members;
CREATE POLICY "Users can view channel members"
  ON channel_members FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can join channels" ON channel_members;
CREATE POLICY "Users can join channels"
  ON channel_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can leave channels" ON channel_members;
CREATE POLICY "Users can leave channels"
  ON channel_members FOR DELETE
  USING (auth.uid() = user_id);

-- Enable realtime for these tables
alter publication supabase_realtime add table channels;
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table channel_members;