const CryptoJS = require("crypto-js");

export default class Common {
    static isNumeric(str: string) {
        return /^-?\d+$/.test(str);
    }
}

// TODO: encode
export const encodeLocal = (plaintext: string | undefined | null) => {
    return plaintext
};

// TODO: decode
export const decodeLocal = (ciphertext: string) => {
    return ciphertext
};

export const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
};

