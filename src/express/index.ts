import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import router from "./router/router";
import { once } from "events";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// app.use((req, _, next) => {
//   if (req.headers["authorization"] === process.env.AUTH) {
//     next();
//   } else {
//     throw "unauthorized";
//   }
// });

app.use("/api", router);

app.use("/isAlive", (_req, res) => {
  res.status(200).send("alive");
});

app.use("*", (_req, res) => {
  res.status(404).send("Invalid Route");
});

const start = async (port) => {
  const server = app.listen(port);
  await once(server, "listening");
};

export default start;
