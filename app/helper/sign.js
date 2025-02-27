import crypto from 'crypto';

export function generateSign(params, apiKey) {
  const sortedKeys = Object.keys(params).sort();
  const stringToSign =
    sortedKeys.map((key) => `${key}=${params[key]}`).join('&') + `&key=${apiKey}`;

  console.log('String to Sign:', stringToSign);

  return crypto.createHash('md5').update(stringToSign, 'utf8').digest('hex').toUpperCase();
}
