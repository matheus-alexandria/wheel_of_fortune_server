import express from "express";
import cors from "cors";
import { createObjectCsvWriter } from "csv-writer";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (request, response) => {
  console.log("Route");
  response.send();
});

app.post("/", (request, response) => {
  const { name, options } = request.body;
  const fileName = `${name}.csv`;

  const csvWriter = createObjectCsvWriter({
    path: `/home/matheus/Documents/projetos/rouletteOnline/server/temp/${fileName}`,
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
