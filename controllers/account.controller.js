import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;

async function createAccount(req, res, next) {
  try {
    let account = req.body;

    if (!account.name || parseInt(account.balance) == null) {
      throw new Error("name e balance are required.");
    }

    const data = JSON.parse(await readFile(global.fileName));

    account = {
      id: data.nextID++,
      name: account.name,
      balance: parseInt(account.balance) || 0
    };

    data.accounts.push(account);

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    logger.info(`POST /account ${JSON.stringify(account)}`);
    res.send(account);
  } catch (error) {
    next(error);
  }
}

async function getAccounts(req, res, next) {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    delete data.nextID;

    logger.info(`GET /account`);
    res.send(data);
  } catch (error) {
    next(error);
  }
}

async function getAccount(req, res, next) {
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
}

async function deleteAccount(req, res, next) {
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
}

async function updateAccount(req, res, next) {
  try {
    let account = req.body;

    if (!account.id || !account.name || parseInt(account.balance) == null) {
      throw new Error("Id,name e balance are required.");
    }
    const data = JSON.parse(await readFile(global.fileName));
    const index = data.accounts.findIndex(a => a.id === parseInt(account.id))

    if (index === -1) {
      throw new Error('Registro não encontrado.');
    }

    data.accounts[index].name = account.name;
    data.accounts[index].balance = parseInt(account.balance) || data.accounts[index].balance;

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    logger.info(`PUT /account ${JSON.stringify(data.accounts[index])}`);
    res.send(account);
  } catch (error) {
    next(error);
  }
}

async function updateBalance(req, res, next) {
  try {
    let account = req.body;

    if (!account.id || !account.name || parseInt(account.balance) == null) {
      throw new Error("Id,name e balance are required.");
    }

    const data = JSON.parse(await readFile(global.fileName));
    const index = data.accounts.findIndex(a => a.id === parseInt(account.id))

    if (index === -1) {
      throw new Error('Registro não encontrado.');
    }

    data.accounts[index].balance = parseInt(account.balance) || data.accounts[index].balance;

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    logger.info(`PATCH /account ${JSON.stringify(data.accounts[index])}`);
    res.send(data.accounts[index]);
  } catch (error) {
    next(error);
  }
}

export default {
  createAccount,
  getAccounts,
  getAccount,
  deleteAccount,
  updateAccount,
  updateBalance
}