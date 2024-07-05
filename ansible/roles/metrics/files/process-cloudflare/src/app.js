import express, { json } from "express";
import { processLogs } from "./processLogs.js";

const app = express();
app.use(json());

app.post("/", async (req, res) => {
  if (!req.body) {
    const msg = "No Pub/Sub Message received";
    console.error(msg);
    res.status(400).send(`Bad Request: ${msg}`);
    return;
  }
  if (!req.body.message) {
    const msg = "invalid Pub/Sub message format";
    console.error(`error: ${msg}`);
    res.status(400).send(`Bad Request: ${msg}`);
    return;
  }
  const eventType = req.body.message.attributes.eventType;

  if (eventType !== "OBJECT_FINALIZE") {
    const msg = `Event type is ${eventType} not OBJECT_FINALIZE`;
    console.error(`error ${msg}`);
    res.status(400).send(`Bad Request: ${msg}`);
    return;
  }

  const bucket = req.body.message.attributes.bucketId;
  const filename = req.body.message.attributes.objectId;
  console.log("EVENT TYPE: ", eventType);
  const { statusCode, message } = await processLogs(bucket, filename);
  res.status(statusCode).send(message);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Listening on port: ", port);
});

export default app;
