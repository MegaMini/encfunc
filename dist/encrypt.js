"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = void 0;
const worker_threads_1 = require("worker_threads");
const crypto_1 = __importDefault(require("crypto"));
const CHUNK_SIZE = 64 * 1024; // 64KB
const encryptData = (data) => {
    let stringData;
    if (typeof data === 'object') {
        stringData = JSON.stringify(data);
    }
    else if (typeof data === 'string') {
        stringData = data;
    }
    else {
        throw new Error('Invalid data type. Only JSON objects or strings are supported.');
    }
    const key = crypto_1.default.randomBytes(32); // 256-bit key
    const iv = crypto_1.default.randomBytes(16); // 128-bit IV
    const cipher = crypto_1.default.createCipheriv('aes-256-cbc', key, iv);
    const encryptedData = Buffer.concat([
        cipher.update(stringData, 'utf-8'),
        cipher.final()
    ]).toString('base64');
    return { encryptedData, encryptedKey: key.toString('base64'), encryptedIV: iv.toString('base64') };
};
const encrypt = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (worker_threads_1.isMainThread) {
        return new Promise((resolve, reject) => {
            try {
                const worker = new worker_threads_1.Worker(__filename, { workerData: data });
                worker.on('message', (result) => resolve(result));
                worker.on('error', reject);
                worker.on('exit', (code) => {
                    if (code !== 0)
                        reject(new Error(`Worker stopped with exit code ${code}`));
                });
            }
            catch (error) {
                console.error(error);
                resolve('[ENC] Error: An error occurred during encryption');
            }
        });
    }
    else {
        try {
            const result = encryptData(worker_threads_1.workerData);
            worker_threads_1.parentPort.postMessage(result);
            return result;
        }
        catch (error) {
            console.error(error);
            worker_threads_1.parentPort.postMessage('[ENC] Error: An error occurred during encryption');
            return '[ENC] Error: An error occurred during encryption';
        }
    }
});
exports.encrypt = encrypt;
