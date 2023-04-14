import express from "express";
import cors from "cors";
import { createObjectCsvWriter } from "csv-writer";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/", (request, response) => {
  const { name, options } = request.body;
  const path = process.env.CSV_FILES_PATH || '';
  const fileName = `${name}.csv`;

  const csvWriter = createObjectCsvWriter({
    path: `${path}${fileName}`,
    header: [
      { id: 'title', title: 'Title'},
      { id: 'weight', title: 'Weight'},
    ]
  });

  csvWriter
    .writeRecords(options)
    .then(() => {
      response.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      response.setHeader('Content-Type', 'text/csv');
      response.sendFile(`/home/matheus/Documents/projetos/rouletteOnline/server/temp/${fileName}`);
    })
    .catch((error) => {
      console.log('Error creating and sending the CSV file: ', error);
      response.status(500).send('Internal Server Error');
    });
});

app.listen(3333, () => {
  console.log("Server running");
});
