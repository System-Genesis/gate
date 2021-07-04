import * as express from 'express';
import helmet = require('helmet');
import morgan = require('morgan');
import router from './router/router';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use((req, _, next) => {
    if (req.headers["authorization"] === process.env.AUTH) {
      next();
    } else {
      throw "unauthorized";
    }
  });
  
  app.use("/api", router);
  
  app.use("/isAlive", (_req, res) => {
    res.status(200).send("alive");
  });
  
  app.use("*", (_req, res) => {
    res.status(404).send("Invalid Route");
  });
