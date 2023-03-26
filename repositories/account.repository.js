import { promises as fs } from 'fs';
const { readFile, writeFile } = fs;

async function getAccounts() {
  const data = JSON.parse(await readFile(global.fileName));
  return data.accounts;
}

async function getAccount(id) {
  const accounts = await getAccounts();
  const data = accounts.find(account => account.id === parseInt(id));

  return data;
}

async function insertAccount(account) {
  const data = JSON.parse(await readFile(global.fileName));

  account = {
    id: data.nextID++,
    name: account.name,
    balance: parseInt(account.balance) || 0
  };

  data.accounts.push(account);
  await writeFile(global.fileName, JSON.stringify(data, null, 2));

  return account;
}
async function deleteAccount(id) {
  const data = JSON.parse(await readFile(global.fileName));
  data.accounts = data.accounts.filter(
    account => account.id !== parseInt(id)
  )
  await writeFile(global.fileName, JSON.stringify(data, null, 2));
}
async function updateAccount(account) {
  const data = JSON.parse(await readFile(global.fileName));
  const index = data.accounts.findIndex(a => a.id === parseInt(account.id))

  if (index === -1) {
    throw new Error('Registro não encontrado.');
  }

  data.accounts[index].name = account.name;
  data.accounts[index].balance = parseInt(account.balance) || data.accounts[index].balance;

  await writeFile(global.fileName, JSON.stringify(data, null, 2));

  return data.accounts[index];
}


export default {
  insertAccount,
  getAccounts,
  getAccount,
  deleteAccount,
  updateAccount,
  // updateBalance
}