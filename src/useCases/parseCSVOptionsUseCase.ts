import { parse } from "csv-parse";
import fs from "fs";

interface WheelOptions {
  title: string;
  percentage: number;
}

export async function parseCSVOptions(file: Express.Multer.File): Promise<WheelOptions[]> {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(file.path);
    const options: WheelOptions[] = [];

    const parseFile = parse({
      delimiter: ";"
    });

    stream.pipe(parseFile);

    parseFile
      .on("data", async (line) => {
        const [title, percentage] = line;

        options.push({
          title,
          percentage
        });
      })
      .on("end", () => {
        fs.promises.unlink(file.path);
        resolve(options);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}