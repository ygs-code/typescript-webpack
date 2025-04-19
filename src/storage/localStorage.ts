import {
    CheckDataType
} from '@/utils';
class LocalStorage {
    static setItem(key: string, value: string) {
        if (CheckDataType.isArray(value) || CheckDataType.isObject(value)) {
            value = JSON.stringify(value)
        }
        localStorage.setItem(key, value);
    }
    static getItem(key: string) {
        return localStorage.getItem(key);
    }
    static removeItem(key: string) {
        localStorage.removeItem(key);
    }
}

export default LocalStorage;