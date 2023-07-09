import express from 'express';
import cors from 'cors';
import { createObjectCsvWriter } from 'csv-writer';
import multer from 'multer';
import { z } from 'zod';
import { env } from './env';
import { ParseCSVOptions } from './useCases/parseCSVOptionsUseCase';

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

const uploader = multer({
  dest: './temp/upload',
});

app.get('/healthcheck', (req, res) => res.json({ message: 'Server online' }));

app.post('/export', (request, response) => {
  const optionSchema = z.object({
    title: z.string(),
    percentage: z.number(),
  });

  const bodySchema = z.object({
    name: z.string().default('no-name-sent'),
    options: z.array(optionSchema),
  });

  const { name, options } = bodySchema.parse(request.body);
  const path = env.CSV_FILES_PATH || '';
  const fileName = `${name}.csv`;

  if (options.length <= 0) {
    response.status(500).send('Data with no options to save');
  }

  const csvWriter = createObjectCsvWriter({
    path: `${path}${fileName}`,
    header: [
      { id: 'title', title: 'Title' },
      { id: 'percentage', title: 'Percentage' },
    ],
    fieldDelimiter: ';',
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

app.post('/import', uploader.single('file'), async (request, response) => {
  const { file } = request;

  if (!file) {
    return response.status(400).send('The file could not be read or does not exist');
  }

  const options = await ParseCSVOptions.execute(file)
    .catch((err) => {
      console.log(err);
      return response.status(400).send({ message: err });
    });

  return response.status(200).json(options);
});

app.listen(env.PORT, () => {
  console.log('Server running');
});
