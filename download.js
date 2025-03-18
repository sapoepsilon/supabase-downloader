import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";
import "dotenv/config";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_KEY;
const downloadPath = "./downloads";

// Debug logging
console.log("URL:", supabaseUrl);
console.log("Key length:", supabaseKey?.length);

const supabase = createClient(supabaseUrl, supabaseKey, {
  global: {
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
    },
  },
});

async function downloadFile(bucketName, filePath) {
  console.log(`Listing files in ${filePath} from ${bucketName}...`);

  try {
    // First, list all files in the path
    const { data: files, error: listError } = await supabase.storage
      .from(bucketName)
      .list(filePath);

    if (listError) {
      console.error(`Error listing files in ${filePath} from ${bucketName}:`);
      console.error("Error details:", JSON.stringify(listError, null, 2));
      return;
    }

    if (!files || files.length === 0) {
      console.log(`No files found in ${filePath}`);
      return;
    }

    console.log(`Found ${files.length} files in ${filePath}`);

    // Download each file
    for (const file of files) {
      const fullFilePath = path.join(filePath, file.name);
      console.log(`Attempting to download ${fullFilePath}...`);

      const { data, error } = await supabase.storage
        .from(bucketName)
        .download(fullFilePath);

      if (error) {
        console.error(`Error downloading ${fullFilePath}:`);
        console.error("Error details:", JSON.stringify(error, null, 2));
        continue;
      }

      try {
        const savePath = path.join(downloadPath, bucketName, fullFilePath);
        await fs.mkdir(path.dirname(savePath), { recursive: true });
        await fs.writeFile(savePath, Buffer.from(await data.arrayBuffer()));
        console.log(`Downloaded: ${savePath}`);
      } catch (fsError) {
        console.error(`File system error for ${fullFilePath}:`, fsError);
      }
    }
  } catch (error) {
    console.error("Operation error:", error);
    throw error;
  }
}

async function downloadBucket(bucketName) {
  try {
    const { data: files, error } = await supabase.storage
      .from(bucketName)
      .list();

    if (error) {
      console.error(`Error listing files in ${bucketName}:`, error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return;
    }

    console.log(`Downloading ${files.length} files from ${bucketName}`);

    for (const file of files) {
      try {
        await downloadFile(bucketName, file.name);
      } catch (fileError) {
        console.error(`Failed to download ${file.name}:`, fileError);
        // Continue with next file
      }
    }
  } catch (listError) {
    console.error("Error listing bucket contents:", listError);
    throw listError;
  }
}

async function downloadAllBuckets() {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error("Error listing buckets:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return;
    }

    console.log(`Found ${buckets.length} buckets`);

    for (const bucket of buckets) {
      await downloadBucket(bucket.name);
    }
  } catch (error) {
    console.error("Error in downloadAllBuckets:", error);
  }
}

// Create downloads directory if it doesn't exist
await fs.mkdir(downloadPath, { recursive: true });

// Start download
downloadAllBuckets().catch(console.error);
