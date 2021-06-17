import crypto from 'crypto';

export default (text) => {
  const hash = crypto.createHmac('sha512', 'mahopcet');
  hash.update(text);
  return hash.digest('hex');
};
