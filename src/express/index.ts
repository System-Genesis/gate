import express from "express";
// import helmet from "helmet";
import morgan from "morgan";
import router from "./router/router";
import isAuth from "../auth/auth";
import { errorMiddleware } from "./middlewares/error";
import { getDocsMiddleware } from "./middlewares/getDocs";

import { once } from "events";

const app = express();

// app.use(helmet());
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
app.use("/isAlive", (_req, res) => {
  res.status(200).send("alive");
});
app.use(getDocsMiddleware());

app.use(isAuth);

app.use("/api", router);

app.use("*", (_req, res) => {
  res.status(404).send("Invalid Route");
});

app.use(errorMiddleware);

const start = async (port) => {
  const server = app.listen(port);
  await once(server, "listening");
  return server;
};

export default start;
export { app };
