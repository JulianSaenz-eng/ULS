import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envFile = readFileSync(join(__dirname, '.env'), 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length) {
    envVars[key.trim()] = values.join('=').trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const publicDir = join(__dirname, 'public');
const imageFiles = readdirSync(publicDir).filter(file =>
  /\.(png|jpg|jpeg|webp|gif)$/i.test(file)
);

console.log(`Found ${imageFiles.length} images to upload\n`);

for (const filename of imageFiles) {
  try {
    const filePath = join(publicDir, filename);
    const fileBuffer = readFileSync(filePath);

    console.log(`Uploading ${filename}...`);

    const { data, error } = await supabase.storage
      .from('landscape-images')
      .upload(filename, fileBuffer, {
        contentType: filename.endsWith('.png') ? 'image/png' :
                    filename.endsWith('.webp') ? 'image/webp' :
                    'image/jpeg',
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error(`  ❌ Failed: ${error.message}`);
    } else {
      console.log(`  ✅ Uploaded successfully`);
    }
  } catch (err) {
    console.error(`  ❌ Error: ${err.message}`);
  }
}

console.log('\n✅ Upload complete! Your images are now permanently stored in Supabase.');
