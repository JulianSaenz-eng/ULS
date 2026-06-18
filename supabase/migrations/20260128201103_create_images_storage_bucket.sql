/*
  # Create Images Storage Bucket

  1. New Storage Bucket
    - `landscape-images` - Public bucket for storing all website images (logos, photos, etc.)
  
  2. Security
    - Enable public access for reading images
    - Allow authenticated users to upload images
    - Set appropriate size and file type restrictions
*/

-- Create a public bucket for landscape images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'landscape-images',
  'landscape-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to all images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public read access'
  ) THEN
    CREATE POLICY "Public read access"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'landscape-images');
  END IF;
END $$;

-- Allow anyone to upload images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public upload access'
  ) THEN
    CREATE POLICY "Public upload access"
    ON storage.objects FOR INSERT
    TO public
    WITH CHECK (bucket_id = 'landscape-images');
  END IF;
END $$;