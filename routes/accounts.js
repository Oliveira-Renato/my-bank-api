import express from 'express';
import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;
const router = express.Router();

//POST
router.post('/', async (req, res, next) => {
  try {
    let account = req.body;
    const data = JSON.parse(await readFile(global.fileName));

    account = { id: data.nextID++, ...account };
    data.accounts.push(account);
    console.log(data)
    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    res.send(account);
  } catch (error) {
    next(error);
  }
})

//GET
router.get('/', async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    delete data.nextID;

    res.send(data);
  } catch (error) {
    next(error);
  }
})

//GET by id
router.get('/:id', async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    const account = data.accounts.find(
      account => account.id === parseInt(req.params.id)
    )
    res.send(account);
  } catch (error) {
    next(error);
  }
})

//DELETE
router.delete('/:id', async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    data.accounts = data.accounts.filter(
      account => account.id !== parseInt(req.params.id)
    )
    await writeFile(global.fileName, JSON.stringify(data, null, 2));
    res.end();
  } catch (error) {
    next(error);
  }
})

//PUT 
router.put('/', async (req, res, next) => {
  try {
    let account = req.body;
    const data = JSON.parse(await readFile(global.fileName));
    const index = data.accounts.findIndex(a => a.id === parseInt(account.id))
    data.accounts[index] = account;

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    res.send(account);
  } catch (error) {
    next(error);
  }
})

//PATCH 
router.patch('/updateBalance', async (req, res, next) => {
  try {
    let account = req.body;
    const data = JSON.parse(await readFile(global.fileName));
    const index = data.accounts.findIndex(a => a.id === parseInt(account.id))
    data.accounts[index].balance = account.balance;

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    res.send(data.accounts[index]);
  } catch (error) {
    next(error);
  }
})

router.use((err, req, res, nex) => {
  console.log(err.message)
  res.status(400).send({ error: err.message });
})

export default router;