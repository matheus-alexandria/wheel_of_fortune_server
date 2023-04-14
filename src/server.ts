import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (request, response) => {
  console.log("Route");
  response.send();
});

app.post("/", (request, response) => {
  const { name, options } = request.body;

  response.json({ name, options });
});

app.listen(3333, () => {
  console.log("Server running");
});

