import * as crypto from 'crypto';

export const encrypt = (text: string): string => {
  const cipher = crypto.createCipheriv(
    process.env.CIPSER_ALGORITHM,
    Buffer.from(process.env.CIPSER_KEY, 'hex'),
    Buffer.from(process.env.CIPSER_IV, 'hex'),
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return encrypted.toString('hex');
};

export const decrypt = (text: string): string => {
  const decipher = crypto.createDecipheriv(
    process.env.CIPSER_ALGORITHM,
    Buffer.from(process.env.CIPSER_KEY, 'hex'),
    Buffer.from(process.env.CIPSER_IV, 'hex'),
  );
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

export const match = (hash: string, needle: string): boolean => {
  const hashedNeedle = encrypt(needle);

  return hash === hashedNeedle;
};

export const getHash = (buffer: Buffer): string => {
  const hashSum = crypto.createHash('sha256');
  hashSum.update(buffer);

  return hashSum.digest('hex');
};
