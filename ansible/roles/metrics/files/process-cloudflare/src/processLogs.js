import { Storage } from "@google-cloud/storage";
import { logTransform2 } from "./logTransform2";

const storage = new Storage();

export const processLogs = async (bucket, filename) => {
  console.log(`Node version is: ${process.version}`);
  console.log(`BUCKET: ${bucket}`);
  console.log(`FILENAME: ${filename}`);

  const filePrefix = filename.split(".")[0];
  const processedFile = filePrefix.split("_").slice(0, 2).join("_");

  console.log(`PROCESSEDFILENAME: ${processedFile}`);

  const readBucket = storage.bucket(bucket);
  const writeBucket = storage.bucket("processed-logs-nodejs");

  try {
    const contents = await readBucket.file(filename).download();

    const stringContents = contents.toString();
    console.log(`String length: ${stringContents.length}`);
    const contentsArray = stringContents.split("\n").filter((line) => line.length > 0);
    console.log(`Array Length: ${contentsArray.length}`);

    let results = "";
    for (const line of contentsArray) {
      try {
        const jsonparse = JSON.parse(line);
        const printout = logTransform2(jsonparse);
        if (printout !== undefined) {
          results = results.concat(printout);
        }
      } catch (err) {
        console.log(err);
      }
    }

    try {
      await writeBucket.file(processedFile).save(results);
      console.log(`Upload complete: ${processedFile}`);
      return {
        statusCode: 200,
        message: `Upload complete: ${processedFile}`,
      };
    } catch (err) {
      console.log(`ERROR UPLOADING ${processedFile} - ${err}`);
      return {
        statusCode: 500,
        message: `Error uploading file: ${processedFile}`,
      };
    } finally {
      const used = process.memoryUsage();
      for (const key in used) {
        console.log(`${key} ${Math.round((used[key] / 1024 / 1024) * 100) / 100} MB`);
      }
    }
  } catch (err) {
    console.log("ERROR IN DOWNLOAD ", filename, err);
    return {
      statusCode: 500,
      message: `Error downloading file: ${filename}`,
    };
  }
};
