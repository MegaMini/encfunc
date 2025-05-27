# EncFunc - Güvenli Şifreleme ve Çözme Kütüphanesi / Secure Encryption and Decryption Library

[English](#english) | [Türkçe](#türkçe)

## English

EncFunc is a powerful and secure encryption/decryption library built with TypeScript, designed to provide robust data protection for your applications. It utilizes AES-256-CBC encryption algorithm and implements worker threads for optimal performance.

### Features

- 🔒 AES-256-CBC encryption algorithm
- 🚀 Worker thread implementation for better performance
- 📦 Support for both string and JSON object encryption
- 🔄 Automatic JSON parsing/stringifying
- 🛡️ Secure key and IV generation
- ⚡ Asynchronous operations
- 📝 TypeScript support with type definitions
- 🎯 Error handling with detailed messages

### Installation

[NPM LINK](https://www.npmjs.com/package/encfunc)
[GITHUB](https://github.com/MegaMini/encfunc/)

```bash
npm install encfunc
# or
yarn add encfunc
# or
pnpm add encfunc
```

### Usage

```typescript
import { encrypt, decrypt } from 'encfunc';

// Encrypting data
const data = { message: "Hello, World!" };
const encrypted = await encrypt(data);
// Returns: { encryptedData: string, encryptedKey: string, encryptedIV: string }

// Decrypting data
const decrypted = await decrypt({
  encryptedData: encrypted.encryptedData,
  encryptedKey: encrypted.encryptedKey,
  encryptedIV: encrypted.encryptedIV
});
// Returns: { message: "Hello, World!" }
```

### Security Features

- Uses cryptographically secure random number generation
- Implements AES-256-CBC encryption
- Secure key and IV management
- Base64 encoding for safe data transmission

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Türkçe

EncFunc, uygulamalarınız için güçlü ve güvenli bir şifreleme/çözme kütüphanesidir. TypeScript ile geliştirilmiş olup, AES-256-CBC şifreleme algoritması kullanır ve en iyi performans için worker thread'ler uygular.

### Özellikler

- 🔒 AES-256-CBC şifreleme algoritması
- 🚀 Daha iyi performans için worker thread implementasyonu
- 📦 Hem string hem de JSON nesne şifreleme desteği
- 🔄 Otomatik JSON ayrıştırma/oluşturma
- 🛡️ Güvenli anahtar ve IV üretimi
- ⚡ Asenkron işlemler
- 📝 TypeScript desteği ve tip tanımlamaları
- 🎯 Detaylı hata mesajları ile hata yönetimi

### Kurulum

[NPM LİNKİ](https://www.npmjs.com/package/encfunc)
[GITHUB](https://github.com/MegaMini/encfunc/)

```bash
npm install encfunc
# veya
yarn add encfunc
# veya
pnpm add encfunc
```

### Kullanım

```typescript
import { encrypt, decrypt } from 'encfunc';

// Veri şifreleme
const data = { message: "Merhaba, Dünya!" };
const encrypted = await encrypt(data);
// Dönen değer: { encryptedData: string, encryptedKey: string, encryptedIV: string }

// Veri çözme
const decrypted = await decrypt({
  encryptedData: encrypted.encryptedData,
  encryptedKey: encrypted.encryptedKey,
  encryptedIV: encrypted.encryptedIV
});
// Dönen değer: { message: "Merhaba, Dünya!" }
```

### Güvenlik Özellikleri

- Kriptografik olarak güvenli rastgele sayı üretimi
- AES-256-CBC şifreleme implementasyonu
- Güvenli anahtar ve IV yönetimi
- Güvenli veri iletimi için Base64 kodlama

### Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen Pull Request göndermekten çekinmeyin.

## License / Lisans

MIT
