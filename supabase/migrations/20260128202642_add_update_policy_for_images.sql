/*
  # Add Update Policy for Images Storage

  1. Security Changes
    - Add public UPDATE policy for landscape-images bucket
    - This allows upsert operations to work correctly when updating existing images
*/

-- Allow anyone to update images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public update access'
  ) THEN
    CREATE POLICY "Public update access"
    ON storage.objects FOR UPDATE
    TO public
    USING (bucket_id = 'landscape-images')
    WITH CHECK (bucket_id = 'landscape-images');
  END IF;
END $$;