import fs from "fs/promises";
export async function cleanUpFiles(files: Express.Multer.File | Express.Multer.File[]) {
  const filesArray = Array.isArray(files) ? files : [files];
  for (const file of filesArray) {
    try {
      await fs.unlink(file.path);
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  }
}