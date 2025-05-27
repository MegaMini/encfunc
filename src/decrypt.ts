import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import crypto from 'crypto';

interface DecryptParams {
  encryptedData: string;
  encryptedKey: string;
  encryptedIV: string;
}

const CHUNK_SIZE = 64 * 1024; // 64KB

const decryptData = ({ encryptedData, encryptedKey, encryptedIV }: DecryptParams): any => {
  const key = Buffer.from(encryptedKey, 'base64');
  const iv = Buffer.from(encryptedIV, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

  const decryptedData = Buffer.concat([
    decipher.update(Buffer.from(encryptedData, 'base64')),
    decipher.final()
  ]).toString('utf-8');

  try {
    return JSON.parse(decryptedData);
  } catch (error) {
    return decryptedData;
  }
};

export const decrypt = async (params: DecryptParams): Promise<any | string> => {
  if (!isMainThread) {
    parentPort!.postMessage(decryptData(workerData));
  } else {
    return new Promise<any | string>((resolve, reject) => {
      try {
        const worker = new Worker(__filename, { workerData: params });
        worker.on('message', (result) => resolve(result));
        worker.on('error', reject);
        worker.on('exit', (code) => {
          if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
        });
      } catch (error) {
        console.error(error);
        resolve('[DEC] Error: An error occurred during decryption');
      }
    });
  }
};
