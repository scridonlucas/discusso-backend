import { Gender } from '../../types/types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isGender = (gender: string): gender is Gender => {
  return ['Male', 'Female', 'Other'].includes(gender);
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

export default { isString, isGender, isDate };
