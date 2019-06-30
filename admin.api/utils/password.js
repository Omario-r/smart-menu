const crypto = require('crypto');

const SaltLength = 9;

function generateSalt(len) {
  const set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
  const setLen = set.length;
  let salt = '';
  for (let i = 0; i < len; i += 1) {
    const p = Math.floor(Math.random() * setLen);
    salt += set[p];
  }
  return salt;
}

function md5(string) {
  return crypto.createHash('md5').update(string).digest('hex');
}

function createHash(password) {
  const salt = generateSalt(SaltLength);
  const hash = md5(password + salt);
  return salt + hash;
}

function validateHash(hash, password) {
  if (!hash) return false;
  const salt = hash.substr(0, SaltLength);
  const validHash = salt + md5(password + salt);
  return hash === validHash;
}

function randomString(size = 10, possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
  let text = '';

  for (let i = 0; i < size; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function randomNumberString(size = 5) {
  return randomString(size, '0123456789');
}

function randomFromArray(arr) {
  const i = Math.floor(Math.random() * arr.length);
  return [arr[i], [...arr.slice(0, i), ...arr.slice(i + 1)]];
}

module.exports = {
  hash: createHash,
  validate: validateHash,
  random: randomString,
  randomNumber: randomNumberString,
  randomFromArray,
};
