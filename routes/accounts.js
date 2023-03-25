import express from 'express';
import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    let account = req.body;
    const data = JSON.parse(await readFile('accounts.json'));

    account = { id: data.nextID++, ...account };
    data.accounts.push(account);
    console.log(data)
    await writeFile('accounts.json', JSON.stringify(data, null, 2));

    res.send(account);
  } catch (error) {
    res.status(400).send({ error: err.message });
  }
})

export default router;