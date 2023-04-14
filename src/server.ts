import express from "express";
import cors from "cors";
import { createObjectCsvWriter } from "csv-writer";

const app = express();
app.use(cors());
app.use(express.json());

const createCsvWriter = createObjectCsvWriter;

app.get("/", (request, response) => {
  console.log("Route");
  response.send();
});

app.post("/", (request, response) => {
  const { name, options } = request.body;

  const csvWriter = createCsvWriter({
    path: `/home/matheus/Documents/projetos/rouletteOnline/server/temp/${name}.csv`,
    header: [
      { id: 'title', title: 'Title'},
      { id: 'weight', title: 'Weight'},
    ]
  });

  csvWriter.writeRecords(options).then();

  response.send();
});

app.listen(3333, () => {
  console.log("Server running");
});
