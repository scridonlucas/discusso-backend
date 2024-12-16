import { Gender, Status } from '../../types/userTypes';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isGender = (gender: string): gender is Gender => {
  return ['MALE', 'FEMALE', 'OTHER'].includes(gender);
};

const isStatus = (status: string): status is Status => {
  return ['ACTIVE', 'BANNED'].includes(status);
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

export default { isString, isGender, isDate, isStatus };
