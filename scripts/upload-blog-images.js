import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

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
  const uploadParams = {
    Bucket: process.env.R2_BUCKET,
    Key: `blog-images/${fileName}`,
    Body: fileStream,
    ContentType: "image/png",
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    console.log(`Success: ${process.env.R2_PUBLIC_URL}/blog-images/${fileName}`);
  } catch (err) {
    console.log("Error", err);
  }
};

const artifactsDir = "C:\\Users\\aquib\\.gemini\\antigravity-ide\\brain\\0d66340b-9814-409e-b0f3-13ff9379692d";

const imagesToUpload = [
  { path: "bac_water_hero_1783901057690.png", name: "bac-water-reconstitution-hero.png" },
  { path: "peptide_chart_1783901069122.png", name: "peptide-reconstitution-concentration-chart.png" },
  { path: "ml_to_units_1783901152011.png", name: "ml-to-units-bac-water-conversion.png" },
  { path: "solvents_compared_1783901084226.png", name: "bacteriostatic-vs-sterile-vs-acetic-acid-water.png" },
  { path: "reconstitute_steps_1783901093861.png", name: "how-to-reconstitute-peptides-steps.png" },
  { path: "cold_storage_1783901104118.png", name: "reconstituted-peptide-storage.png" },
];

(async () => {
  for (const img of imagesToUpload) {
    const fullPath = path.join(artifactsDir, img.path);
    if (fs.existsSync(fullPath)) {
      await uploadImage(fullPath, img.name);
    } else {
      console.log(`File not found: ${fullPath}`);
    }
  }
})();
