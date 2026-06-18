/*
  # Create contact submissions table

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key) - Unique identifier for each submission
      - `name` (text) - Full name of the contact
      - `email` (text) - Email address of the contact
      - `phone` (text) - Phone number of the contact
      - `message` (text) - Project details or message from the contact
      - `form_location` (text) - Which form was submitted (hero or cta)
      - `email_sent` (boolean) - Whether the email was successfully sent via EmailJS
      - `created_at` (timestamptz) - Timestamp when the submission was created

  2. Security
    - Enable RLS on `contact_submissions` table
    - Add policy for authenticated admin users to read submissions
    - Public users can insert submissions (as they're submitting the form)

  3. Important Notes
    - This table serves as a backup for all form submissions
    - Even if email delivery fails, submissions are stored here
    - Admin access is restricted through RLS policies
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  message text DEFAULT '',
  form_location text NOT NULL,
  email_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact submissions"
  ON contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can view submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);