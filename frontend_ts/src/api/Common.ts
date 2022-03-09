export default class Common {
    static isNumeric(str: string) {
        return /^-?\d+$/.test(str);
    }
}