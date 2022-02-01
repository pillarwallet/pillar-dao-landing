// constants
import { STORAGE_MAIN_KEY } from '../constants/storageConstants';


export const setItem = (key, value) => localStorage.setItem(`${STORAGE_MAIN_KEY}:${key}`, value);

export const getItem = (key) => localStorage.getItem(`${STORAGE_MAIN_KEY}:${key}`);
