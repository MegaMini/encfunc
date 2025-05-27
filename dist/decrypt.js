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
exports.decrypt = void 0;
const worker_threads_1 = require("worker_threads");
const crypto_1 = __importDefault(require("crypto"));
const CHUNK_SIZE = 64 * 1024; // 64KB
const decryptData = ({ encryptedData, encryptedKey, encryptedIV }) => {
    const key = Buffer.from(encryptedKey, 'base64');
    const iv = Buffer.from(encryptedIV, 'base64');
    const decipher = crypto_1.default.createDecipheriv('aes-256-cbc', key, iv);
    const decryptedData = Buffer.concat([
        decipher.update(Buffer.from(encryptedData, 'base64')),
        decipher.final()
    ]).toString('utf-8');
    try {
        return JSON.parse(decryptedData);
    }
    catch (error) {
        return decryptedData;
    }
};
const decrypt = (params) => __awaiter(void 0, void 0, void 0, function* () {
    if (!worker_threads_1.isMainThread) {
        worker_threads_1.parentPort.postMessage(decryptData(worker_threads_1.workerData));
    }
    else {
        return new Promise((resolve, reject) => {
            try {
                const worker = new worker_threads_1.Worker(__filename, { workerData: params });
                worker.on('message', (result) => resolve(result));
                worker.on('error', reject);
                worker.on('exit', (code) => {
                    if (code !== 0)
                        reject(new Error(`Worker stopped with exit code ${code}`));
                });
            }
            catch (error) {
                console.error(error);
                resolve('[DEC] Error: An error occurred during decryption');
            }
        });
    }
});
exports.decrypt = decrypt;
