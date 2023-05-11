import express from 'express';
import accountsRouter from './routes/accounts.routes.js';
import { promises as fs } from 'fs';
import winston from 'winston';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './doc.js';

const { readFile, writeFile } = fs;
const { combine, label, timestamp, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
})

global.fileName = 'accounts.json';
//Logger settings
global.logger = winston.createLogger({
  level: "silly",
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'my-bank-api.log' })
  ],
  format: combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    label({ label: 'my-bank-api' }),
    myFormat
  )
})

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/account', accountsRouter);


app.listen(port, async () => {
  try {
    await readFile(global.fileName);
    logger.info('API started.')
  } catch (error) {
    const initialJson = {
      nextID: 1,
      accounts: []
    }
    writeFile(global.fileName, JSON.stringify(initialJson)).then(() => {
      logger.info('API started and file created.')
    }).catch(err => logger.info(err));
  }
});
