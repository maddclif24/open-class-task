import crypto from 'crypto';

export default (password, salt) => {
  const randomSalt = salt ?? Math.random().toString(36).substring(2);
  const hash = crypto.createHmac('sha512', randomSalt);
  hash.update(password);
  return [hash.digest('hex'), randomSalt];
};
