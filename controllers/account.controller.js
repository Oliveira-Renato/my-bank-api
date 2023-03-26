import ServicesAccount from '../services/account.services.js';
import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;

async function createAccount(req, res, next) {
  try {
    let account = req.body;

    if (!account.name || parseInt(account.balance) == null) {
      throw new Error("name e balance are required.");
    }

    account = await ServicesAccount.createAccount(account);

    logger.info(`POST /account ${JSON.stringify(account)}`);
    res.send(account);
  } catch (error) {
    next(error);
  }
}

async function getAccounts(req, res, next) {
  try {
    logger.info(`GET /account`);
    res.send(await ServicesAccount.getAccounts());
  } catch (error) {
    next(error);
  }
}

async function getAccount(req, res, next) {
  try {
    logger.info(`GET /account/:id`);
    res.send(await ServicesAccount.getAccount(req.params.id));
  } catch (error) {
    next(error);
  }
}

async function deleteAccount(req, res, next) {
  try {
    await ServicesAccount.deleteAccount(req.params.id);
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

    logger.info(`PUT /account ${JSON.stringify(await ServicesAccount.updateAccount(account))}`);
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

    logger.info(`PATCH /account ${JSON.stringify(account)}`);
    res.send(await ServicesAccount.updateBalance(account));
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