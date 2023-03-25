import express from 'express';
import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;
const router = express.Router();

//POST
router.post('/', async (req, res) => {
  try {
    let account = req.body;
    const data = JSON.parse(await readFile(global.fileName));

    account = { id: data.nextID++, ...account };
    data.accounts.push(account);
    console.log(data)
    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    res.send(account);
  } catch (error) {
    res.status(400).send({ error: err.message });
  }
})

//GET
router.get('/', async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    delete data.nextID;

    res.send(data);
  } catch (error) {
    res.status(400).send({ error: err.message });
  }
})

//GET by id
router.get('/:id', async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    const account = data.accounts.find(
      account => account.id === parseInt(req.params.id)
    )
    res.send(account);
  } catch (error) {
    res.status(400).send({ error: err.message });
  }
})

export default router;