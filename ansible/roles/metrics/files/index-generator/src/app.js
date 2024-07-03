import express, { json } from "express";
import { generateIndex } from "./generateIndex.js";

const app = express();
app.use(json());

app.post("/", async (req, res) => {
  if (req.body.message.attributes.objectId !== "index.html") {
    await generateIndex();
  }
  res.status(200).send();
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Listening on port: ", port);
});

export default app;
