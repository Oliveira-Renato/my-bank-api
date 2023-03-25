import express from 'express';
import accountsRouter from '../routes/accounts.js';
import { promises as fs } from 'fs';

global.fileName = 'accounts.json';

const { readFile, writeFile } = fs;
const app = express();
const port = 3000;

app.use(express.json());
app.use('/account', accountsRouter);

app.listen(port, async () => {
  try {
    await readFile(global.fileName);
    console.log(`App listening on port:${port}`);
  } catch (error) {
    const initialJson = {
      nextID: 1,
      accounts: []
    }
    writeFile(global.fileName, JSON.stringify(initialJson)).then(() => {
      console.log(`App listening on ${port}`);
    }).catch(err => console.log(err));
  }
});
