/*
  # Add Notifications System
  
  1. New Tables
    - notifications: Stores user notifications
      - id: Unique identifier
      - user_id: Reference to users table
      - type: Notification type (success, error, info)
      - message: Notification message
      - metadata: Additional data (JSONB)
      - read: Read status
      - created_at: Creation timestamp
  
  2. Changes
    - Add webhook_url to scraping_jobs metadata
  
  3. Security
    - Enable RLS on notifications table
    - Add policies for authenticated users
*/

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  type text NOT NULL,
  message text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  read boolean DEFAULT false,
  
  CONSTRAINT valid_type CHECK (type IN ('success', 'error', 'info', 'warning'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_read_idx ON notifications(read);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON notifications(created_at);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can view their own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add trigger for cleanup of old notifications
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS trigger AS $$
BEGIN
  DELETE FROM notifications
  WHERE created_at < NOW() - INTERVAL '30 days'
  AND read = true;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cleanup_old_notifications_trigger
  AFTER INSERT ON notifications
  EXECUTE FUNCTION cleanup_old_notifications();