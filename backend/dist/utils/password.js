"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
const crypto_1 = require("crypto");
const KEY_LENGTH = 64;
function scryptAsync(password, salt) {
    return new Promise((resolve, reject) => {
        (0, crypto_1.scrypt)(password, salt, KEY_LENGTH, (err, derivedKey) => {
            if (err)
                reject(err);
            else
                resolve(derivedKey);
        });
    });
}
async function hashPassword(password) {
    const salt = (0, crypto_1.randomBytes)(16);
    const derivedKey = await scryptAsync(password, salt);
    return `${salt.toString('hex')}:${derivedKey.toString('hex')}`;
}
async function verifyPassword(password, storedHash) {
    const [saltHex, keyHex] = storedHash.split(':');
    if (!saltHex || !keyHex) {
        return false;
    }
    const salt = Buffer.from(saltHex, 'hex');
    const expectedKey = Buffer.from(keyHex, 'hex');
    const derivedKey = await scryptAsync(password, salt);
    return derivedKey.length === expectedKey.length && (0, crypto_1.timingSafeEqual)(derivedKey, expectedKey);
}
//# sourceMappingURL=password.js.map