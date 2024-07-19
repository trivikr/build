import { Storage } from "@google-cloud/storage";

const storage = new Storage();
const BUCKET = "access-logs-summaries-nodejs";

export const generateIndex = async () => {
  const [files] = await storage.bucket(BUCKET).getFiles();
  const fileList = files.map((file) => file.name).filter((file) => !file.includes("html"));

  const baseURL = `https://storage.googleapis.com/${BUCKET}/`;
  const getFileEntry = (file) => `<p><a·href="${baseURL.concat(file)}">${file}</a></p>\n`;
  const body = fileList.reduce((acc, file) => acc.concat(getFileEntry(file)), "");

  const fileContents = `<html>\n\t<head>\n\t</head>\n\t<body>\n${body}\t</body>\n</html>`;
  const fileName = "index.html";
  try {
    await storage.bucket(BUCKET).file(fileName).save(fileContents);
    console.log(`Upload complete: ${fileName}`);
  } catch (error) {
    console.error(`ERROR UPLOADING FILE: ${fileName} - ${error}`);
  }
};
