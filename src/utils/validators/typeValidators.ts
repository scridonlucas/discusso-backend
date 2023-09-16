import { Gender } from '../../../types';

export const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

export const isGender = (gender: string): gender is Gender => {
  return ['Male', 'Female', 'Other'].includes(gender);
};

export const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};
