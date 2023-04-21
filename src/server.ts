import express from "express";
import cors from "cors";
import { createObjectCsvWriter } from "csv-writer";
import "dotenv/config";

interface OptionsData {
  name: string;
  options: {
    title: string;
    percentage: number;
  }[]
}

const app = express();
app.use(cors());
app.use(express.json());

app.post("/export", (request, response) => {
  const { name, options }: OptionsData = request.body;
  const path = process.env.CSV_FILES_PATH || '';
  const fileName = `${name}.csv`;

  if (options.length <= 0) {
    response.status(500).send("Data with no options to save");
  }

  const csvWriter = createObjectCsvWriter({
    path: `${path}${fileName}`,
    header: [
      { id: 'title', title: 'Title'},
      { id: 'percentage', title: 'Percentage'},
    ],
    fieldDelimiter: ";"
  });

  csvWriter
    .writeRecords(options)
    .then(() => {
      response.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      response.setHeader('Content-Type', 'text/csv');
      response.sendFile(`${path}${fileName}`);
    })
    .catch((error) => {
      console.log('Error creating and sending the CSV file: ', error);
      response.status(500).send('Internal Server Error');
    });
});

app.post("/import", (request, response) => {
  
});

app.listen(3333, () => {
  console.log("Server running");
});
