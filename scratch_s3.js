import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const client = new S3Client({
  endpoint: process.env.R2_ENDPOINT,
  region: "auto",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function run() {
  let isTruncated = true;
  let continuationToken = undefined;
  const allKeys = [];

  while (isTruncated) {
    const command = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET,
      Prefix: "Product Images/",
      ContinuationToken: continuationToken,
    });

    try {
      const response = await client.send(command);
      response.Contents.forEach((item) => allKeys.push(item.Key));
      isTruncated = response.IsTruncated;
      continuationToken = response.NextContinuationToken;
    } catch (err) {
      console.error(err);
      break;
    }
  }
  
  fs.writeFileSync("r2_keys.json", JSON.stringify(allKeys, null, 2));
  console.log(`Saved ${allKeys.length} keys to r2_keys.json`);
}

run();
