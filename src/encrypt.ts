import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import crypto from 'crypto';

interface EncryptResult {
  encryptedData: string;
  encryptedKey: string;
  encryptedIV: string;
}

const CHUNK_SIZE = 64 * 1024; // 64KB

const encryptData = (data: any): EncryptResult => {
  let stringData: string;
  if (typeof data === 'object') {
    stringData = JSON.stringify(data);
  } else if (typeof data === 'string') {
    stringData = data;
  } else {
    throw new Error('Invalid data type. Only JSON objects or strings are supported.');
  }

  const key = crypto.randomBytes(32); // 256-bit key
  const iv = crypto.randomBytes(16); // 128-bit IV
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

  const encryptedData = Buffer.concat([
    cipher.update(stringData, 'utf-8'),
    cipher.final()
  ]).toString('base64');

  return { encryptedData, encryptedKey: key.toString('base64'), encryptedIV: iv.toString('base64') };
};

export const encrypt = async (data: any): Promise<EncryptResult | string> => {
  if (isMainThread) {
    return new Promise<EncryptResult | string>((resolve, reject) => {
      try {
        const worker = new Worker(__filename, { workerData: data });
        worker.on('message', (result) => resolve(result as EncryptResult));
        worker.on('error', reject);
        worker.on('exit', (code) => {
          if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
        });
      } catch (error) {
        console.error(error);
        resolve('[ENC] Error: An error occurred during encryption');
      }
    });
  } else {
    try {
      const result = encryptData(workerData);
      parentPort!.postMessage(result);
      return result;
    } catch (error) {
      console.error(error);
      parentPort!.postMessage('[ENC] Error: An error occurred during encryption');
      return '[ENC] Error: An error occurred during encryption';
    }
  }
};
