import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import mime from "mime-types";

dotenv.config({ path: ".env" });

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const uploadImage = async (filePath, fileName) => {
  const fileStream = fs.createReadStream(filePath);
  const contentType = mime.lookup(filePath) || "application/octet-stream";
  const uploadParams = {
    Bucket: process.env.R2_BUCKET,
    Key: `blog-images/${fileName}`,
    Body: fileStream,
    ContentType: contentType,
  };

  try {
    await s3Client.send(new PutObjectCommand(uploadParams));
    console.log(`Success: ${process.env.R2_PUBLIC_URL}/blog-images/${fileName}`);
    return true;
  } catch (err) {
    console.log(`Error uploading ${fileName}:`, err);
    return false;
  }
};

const imagesDir = path.join(process.cwd(), "public", "99 Blog Images");

(async () => {
  if (!fs.existsSync(imagesDir)) {
    console.log(`Directory not found: ${imagesDir}`);
    return;
  }

  const files = fs.readdirSync(imagesDir);
  let successCount = 0;
  let failureCount = 0;

  for (const file of files) {
    const fullPath = path.join(imagesDir, file);
    // Skip directories
    if (fs.statSync(fullPath).isDirectory()) continue;

    console.log(`Uploading ${file}...`);
    const success = await uploadImage(fullPath, file);
    if (success) successCount++;
    else failureCount++;
  }

  console.log(`\nUpload complete! Success: ${successCount}, Failures: ${failureCount}`);
})();
