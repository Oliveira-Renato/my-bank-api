import express from 'express';
import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;
const router = express.Router();

//POST
router.post('/', async (req, res, next) => {
  debugger
  try {
    let account = req.body;
    const data = JSON.parse(await readFile(global.fileName));

    account = { id: data.nextID++, ...account };
    data.accounts.push(account);

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    logger.info(`POST /account ${JSON.stringify(account)}`);
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

    logger.info(`GET /account`);
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

    logger.info(`GET /account/:id`);
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

    logger.info(`DELETE /account/:id`);
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

    logger.info(`PUT /account ${JSON.stringify(data.accounts[index])}`);
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

    logger.info(`PATCH /account ${JSON.stringify(data.accounts[index])}`);
    res.send(data.accounts[index]);
  } catch (error) {
    next(error);
  }
})

router.use((err, req, res, nex) => {
  logger.error(`${req.method} ${req.baseUrl} ${err.message}`);
  res.status(400).send({ error: err.message });
})

export default router;